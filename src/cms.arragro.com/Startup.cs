﻿using Arragro.Core.Common.Models;
using ArragroCMS.Core.Models;
using ArragroCMS.Web.Management.Extensions;
using ArragroCMS.Web.Management.Filters;
using ArragroCMS.Web.Management.Middleware;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;

namespace cms.arragro.com
{
    public class Startup
    {
        public const string ObjectIdentifierType = "http://schemas.microsoft.com/identity/claims/objectidentifier";
        public const string TenantIdType = "http://schemas.microsoft.com/identity/claims/tenantid";

        private readonly ILoggerFactory _loggerFactory;
        
        public Startup(IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            Log.Logger = new LoggerConfiguration()
              .Enrich.FromLogContext()
              .WriteTo.LiterateConsole()
              .WriteTo.RollingFile("App_Data/Logs/log-{Date}.txt", fileSizeLimitBytes: 536870912, retainedFileCountLimit: 7)
              .CreateLogger();

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            
            if (env.IsDevelopment())
            {
                builder.AddUserSecrets<Startup>();
            }

            Configuration = builder.Build();

            ConfigurationSettings = Configuration.Get<ConfigurationSettings>();

            Environment = env;

            _loggerFactory = loggerFactory;

        }

        public IConfiguration Configuration { get; }
        public ConfigurationSettings ConfigurationSettings { get; }
        public IHostingEnvironment Environment { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            try
            {
                var logger = _loggerFactory.CreateLogger<Startup>();
                logger.LogInformation("Starting the configuration of the ArragroCmsServices");

                services.AddDefaultArragroCmsServices(
                    Configuration,
                    Environment,
                    ConfigurationSettings, 
                    new CultureInfo("en"), 
                    new CultureInfo[] { new CultureInfo("en-nz") }, 
                    new TimeSpan(2, 0, 0),
                    true,
                    "Arragro.Dynamic.Api", "Arragro.Dynamic", "ArragroCMS.Web.Management");

                // Replace Image Provider with ImageServiceProvider
                // services.Remove(services.FirstOrDefault(descriptor => descriptor.ServiceType == typeof(IImageProvider)));
                // services.AddSingleton<IImageProvider>(s => new Arragro.Providers.ImageServiceProvider.ImageProvider(Configuration["ApplicationSettings:ImageServiceUrl"], 40000));
                services.AddSingleton<BaseSettings>(ConfigurationSettings);
                services.AddLogging(configure => configure.AddSerilog());

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
                    var defaultPolicy = new AuthorizationPolicyBuilder(services.GetDefaultAuthenticationSchemas())
                                     .RequireAuthenticatedUser()
                                     .Build();

                    config.Filters.Add(new AuthorizeFilter(defaultPolicy));

                    config.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
                    config.Filters.Add(new ValidateModelAttribute());

                    var removals = new List<Type>
                    {
                        typeof(Arragro.Dynamic.Api.Controllers.TemplateController)
                    };

                    config.Conventions.Add(new RoutingControllerOverrideConvention(removals));
                }).AddApplicationPart(typeof(Arragro.Dynamic.Api.Controllers.ComponentController).GetTypeInfo().Assembly)
                  .AddApplicationPart(typeof(ArragroCMS.Web.Management.Controllers.AccountController).GetTypeInfo().Assembly);

                var serviceProvider = services.BuildServiceProvider();
                var env = serviceProvider.GetService<IHostingEnvironment>();

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
                    if (env.IsDevelopment())
                    {
                        options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
                        options.HttpsPort = 5003;
                    }
                });

                return serviceProvider;
            }
            catch (Exception ex)
            {
                Log.Logger.Error<Exception>("Configure Services Failed: {ex}", ex);
                throw;
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IServiceProvider serviceProvider, IHostingEnvironment env, IAntiforgery antiforgery)
        {
            if (env.IsDevelopment())
            {
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });

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
            app.UseCompressedStaticFiles();
            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseArragroCMS(antiforgery);

            app.UseResponseCompression();

            app.UseMiddleware<AuthorizeCorrectlyMiddleware>();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "web-info/{secret}",
                    template: "{controller=WebInfo}/{action=Index}/{secret?}");

                routes.MapRoute(
                    name: "default",
                    template: "{controller=ArragroCms}/{action=Index}/{id?}/{status?}");

                routes.MapSpaFallbackRoute("spa-fallback", new { controller = "ArragroCms", action = "Index" });
            });
        }
    }
}
