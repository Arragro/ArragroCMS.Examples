using ArragroCMS.Core.Models;
using ArragroCMS.Web.Management.Extensions;
using ArragroCMS.Web.Management.Filters;
using ArragroCMS.Web.Management.Middleware;
using cms.arragro.com.Extentions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using System;
using System.Globalization;
using System.IO.Compression;

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
              .WriteTo.RollingFile("App_Data\\Logs\\log-{Date}.txt", fileSizeLimitBytes: 536870912, retainedFileCountLimit: 7)
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

            _loggerFactory = loggerFactory;
            _loggerFactory.AddSerilog();

        }

        public IConfigurationRoot Configuration { get; }
        public ConfigurationSettings ConfigurationSettings { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            try
            {
                var logger = _loggerFactory.CreateLogger<Startup>();
                logger.LogInformation("Starting the configuration of the ArragroCmsServices");

                services.AddCustomArragroCmsServices(ConfigurationSettings, new CultureInfo("en"), new CultureInfo[] { new CultureInfo("en-nz") }, new TimeSpan(1, 0, 0), "arragro.com.ContentTypes");

                logger.LogInformation("Finished configuring of the ArragroCmsServices");

                services.Configure<GzipCompressionProviderOptions>
                    (options => options.Level = CompressionLevel.Fastest);

                services.AddResponseCompression(options =>
                {
                    options.Providers.Add<GzipCompressionProvider>();
                });

                services.AddMvc(config =>
                {
                    var defaultPolicy = new AuthorizationPolicyBuilder(services.GetDefaultAuthenticationSchemas())
                                     .RequireAuthenticatedUser()
                                     .Build();

                    config.Filters.Add(new AuthorizeFilter(defaultPolicy));

                    config.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
                    config.Filters.Add(new ValidateModelAttribute());
                });

                var sb = services.BuildServiceProvider();
                var protector = sb.GetDataProtector("ArragroCMS");

                // protect the payload
                var protectedPayload = protector.Protect("Hello World!");
                Console.WriteLine($"Protect returned: {protectedPayload}");

                // unprotect the payload
                var unprotectedPayload = protector.Unprotect(protectedPayload);
                Console.WriteLine($"Unprotect returned: {unprotectedPayload}");

                return services.BuildServiceProvider();
            }
            catch (Exception ex)
            {
                Log.Logger.Error<Exception>("Configure Services Failed: {ex}", ex);
                throw;
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IServiceProvider serviceProvider, IHostingEnvironment env, ILoggerFactory loggerFactory, IApplicationLifetime appLifetime)
        {
            loggerFactory.AddSerilog();
            appLifetime.ApplicationStopped.Register(Log.CloseAndFlush);

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
            }

            app.UseDefaultFiles();
            app.UseCompressedStaticFiles();
            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseArragroCMS(serviceProvider);

            app.UseResponseCompression();

            app.UseMiddleware<AuthorizeCorrectlyMiddleware>();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=ArragroCms}/{action=Index}/{id?}/{status?}");

                routes.MapSpaFallbackRoute("spa-fallback", new { controller = "ArragroCms", action = "Index" });
            });
        }
    }
}
