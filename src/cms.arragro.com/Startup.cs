using Arragro.Core.Common.Models;
using Arragro.Core.Web.ApplicationModels;
using ArragroCMS.Core.Models;
using ArragroCMS.Web.Management.Extensions;
using ArragroCMS.Web.Management.Filters;
using ArragroCMS.Web.ReadOnlyApi.Extentions;
using ArragroCMS.Web.ReadOnlyApi.Handlers;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;

namespace cms.arragro.com
{
    public class Startup
    {
        public const string ObjectIdentifierType = "http://schemas.microsoft.com/identity/claims/objectidentifier";
        public const string TenantIdType = "http://schemas.microsoft.com/identity/claims/tenantid";

        private readonly ILoggerFactory _loggerFactory;

        public Startup(IConfiguration configuration, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            Configuration = configuration;
            ConfigurationSettings = Configuration.Get<ConfigurationSettings>();
            Environment = env;
            _loggerFactory = loggerFactory;
        }

        public IConfiguration Configuration { get; }
        public ConfigurationSettings ConfigurationSettings { get; }
        public IWebHostEnvironment Environment { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            try
            {
                var logger = _loggerFactory.CreateLogger<Startup>();
                logger.LogInformation("Checking {Configuration}", Configuration);
                logger.LogInformation("Starting the configuration of the ArragroCmsServices");

                var defaultSchemas = new List<string>()
                {
                    JwtBearerDefaults.AuthenticationScheme,
                    CookieAuthenticationDefaults.AuthenticationScheme
                };
                if (ConfigurationSettings.ApplicationSettings.UseAccessTokenInQueryString)
                    defaultSchemas.Add(AccessTokenQueryStringAuthenticationHandler.AuthenticationScheme);
                
                services.AddCustomHealthCheck(ConfigurationSettings)
                    .AddDefaultArragroCmsServices(
                        Configuration,
                        Environment,
                        ConfigurationSettings, 
                        new CultureInfo("en"), 
                        new CultureInfo[] { new CultureInfo("en-nz") }, 
                        new TimeSpan(2, 0, 0),
                        defaultSchemas.ToArray(),
                        true);

                if (Configuration["ApplicationInsights:InstrumentationKey"] != null)
                    services.AddApplicationInsightsTelemetryWorkerService(Configuration["ApplicationInsights:InstrumentationKey"]);

                // Replace Image Provider with ImageServiceProvider
                // services.Remove(services.FirstOrDefault(descriptor => descriptor.ServiceType == typeof(IImageProvider)));
                // services.AddSingleton<IImageProvider>(s => new Arragro.Providers.ImageServiceProvider.ImageProvider(Configuration["ApplicationSettings:ImageServiceUrl"], 40000));

                //services.Remove<IStorageProvider>();
                //services.AddSingleton<IStorageProvider, S3StorageProvider>();

                services.AddSingleton<BaseSettings>(ConfigurationSettings);
                services.AddLogging(configure => configure.AddSerilog());

                ArragroCMS.Web.ReadOnlyApi.Extentions.ServiceCollectionExtensions.RegisterFilterAttributes(services);

                var authBuilder = services.BuildArragroCmsAuthentication(ConfigurationSettings, new TimeSpan(2, 0, 0));
                authBuilder
                    .AddJwtBearer(options =>
                    {
                        var cert = new X509Certificate2(File.ReadAllBytes(ConfigurationSettings.JwtSettings.CertificatePath), ConfigurationSettings.JwtSettings.Password);
                        var key = new X509SecurityKey(cert);

                        options.TokenValidationParameters = new TokenValidationParameters()
                        {
                            ValidIssuer = ConfigurationSettings.JwtSettings.Issuer,
                            ValidAudience = ConfigurationSettings.JwtSettings.Audience,
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = key,
                            ValidateLifetime = true
                        };
                    });

                if (ConfigurationSettings.ApplicationSettings.UseAccessTokenInQueryString)
                    authBuilder.AddScheme<AuthenticationSchemeOptions, AccessTokenQueryStringAuthenticationHandler>(AccessTokenQueryStringAuthenticationHandler.AuthenticationScheme, null);

                services.AddDefaultArragroCmsAndReadOnylApiAuthorization(ConfigurationSettings);

                logger.LogInformation("Finished configuring of the ArragroCmsServices");

                services.Configure<GzipCompressionProviderOptions>
                    (options => options.Level = CompressionLevel.Fastest);

                services.AddResponseCompression(options =>
                {
                    options.Providers.Add<GzipCompressionProvider>();
                    options.EnableForHttps = true;
                });

                services.AddMvc(config =>
                {
                    config.Filters.Add(new AuthorizeFilter());
                    config.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
                    config.Filters.Add(new AuthenticationResultFilter());
                    config.Filters.Add(new ValidateModelAttribute());

                    var removals = new List<Type>
                    {
                        typeof(Arragro.Dynamic.Api.Controllers.TemplateController)
                    };

                    config.Conventions.Add(new RoutingControllerOverrideConvention(removals));
                }).AddApplicationPart(typeof(Arragro.Dynamic.Api.Controllers.ComponentController).GetTypeInfo().Assembly)
                  .AddApplicationPart(typeof(ArragroCMS.Web.Management.Controllers.AccountController).GetTypeInfo().Assembly)
                  .AddNewtonsoftJson(); 

                services.AddHsts(options =>
                {
                    options.Preload = true;
                    options.IncludeSubDomains = true;
                    options.MaxAge = TimeSpan.FromDays(60);
                    //options.ExcludedHosts.Add("example.com");
                    //options.ExcludedHosts.Add("www.example.com");
                });

                services.AddHttpsRedirection(options =>
                {
                    if (Environment.IsDevelopment())
                    {
                        options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
                        options.HttpsPort = 5003;
                    }
                });
            }
            catch (Exception ex)
            {
                Log.Logger.Error<Exception>("Configure Services Failed: {ex}", ex);
                throw;
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IServiceProvider serviceProvider, IWebHostEnvironment env, IAntiforgery antiforgery)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseWhen(x => !x.Request.Path.Value.StartsWith("/api"), builder =>
                {
                    builder.UseExceptionHandler("/Home/Error");
                });
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseDefaultFiles();
            if (!env.IsDevelopment())
            {
                app.UseCompressedStaticFiles();
            }
            app.UseStaticFiles();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseArragroCMS(antiforgery);

            app.UseResponseCompression();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default-spa",
                    pattern: "{controller=ArragroCms}/{action=Index}/{id?}/{status?}");

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=MicrosoftAccount}/{action=Index}/{id?}");

                endpoints.MapHealthChecks("/hc", new HealthCheckOptions()
                {
                    Predicate = _ => true,
                    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
                    ResultStatusCodes =
                    {
                        [HealthStatus.Healthy] = StatusCodes.Status200OK,
                        [HealthStatus.Degraded] = StatusCodes.Status200OK,
                        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable
                    }
                });
                endpoints.MapHealthChecks("/liveness", new HealthCheckOptions
                {
                    Predicate = r => r.Name.Contains("self")
                });


                endpoints.MapFallbackToController("Index", "ArragroCms");
            });
        }
    }
}
