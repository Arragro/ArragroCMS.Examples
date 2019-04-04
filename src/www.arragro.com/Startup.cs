using Arragro.Core.Common.Interfaces;
using Arragro.Core.Common.Models;
using Arragro.Core.DistributedCache;
using Arragro.Core.Web.Extensions;
using ArragroCMS.Management.Extensions;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;

namespace www.arragro.com
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
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
            ConfigurationSettings = Configuration.Get<BaseSettings>();
        }

        public IConfigurationRoot Configuration { get; }
        public BaseSettings ConfigurationSettings { get; }

        private byte[] ReadStreamAsBytes(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }
        
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddOptions()
                .AddLogging()
                .ConfigureArraroCMSService(Configuration)
                .AddAntiforgery(options =>
                {
                    options.HeaderName = "X-CSRF-TOKEN";
                    options.Cookie.SameSite = SameSiteMode.Strict;
                    options.Cookie.Name = "arragro-antiforgery";
                })
                .AddSingleton(ConfigurationSettings);

            services.ConfigureDataProtection(ConfigurationSettings);

            services.Configure<GzipCompressionProviderOptions>
                (options => options.Level = CompressionLevel.Fastest);

            services.AddDistributedMemoryCache();

            services.AddTransient<DistributedCacheManager>();
            services.AddSingleton(new DistributedCacheEntryOptions { SlidingExpiration = new TimeSpan(0, 5, 0) });

            services.AddResponseCompression(options =>
            {
                options.Providers.Add<GzipCompressionProvider>();
            });

            services.AddMvc();

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
                    options.HttpsPort = 5005;
                }
            });

            return serviceProvider;
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IApplicationLifetime appLifetime, IAntiforgery antiforgery)
        {
            loggerFactory.AddSerilog();

            appLifetime.ApplicationStopped.Register(Log.CloseAndFlush);

            if (env.IsDevelopment())
            {
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                   HotModuleReplacement = true
                });

                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(("/error/exception"));
                app.UseStatusCodePagesWithReExecute("/error/{0}");
            }

            app.UseHsts();
            app.UseHttpsRedirection();

            app.UseDefaultFiles();
            app.UseCompressedStaticFiles();
            app.UseStaticFiles();


            var defaultCulture = new CultureInfo("en");
            var supportedCultures = new CultureInfo[] { new CultureInfo("en") };

            app.UseArragroCMS(defaultCulture, supportedCultures);

            app.UseResponseCompression();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "web-info/{secret}",
                    template: "{controller=WebInfo}/{action=Index}/{secret?}");

                routes.MapRoute(
                    name: "default",
                    template: "{controller=LandingPage}/{action=Home}/{siteId?}/{id?}/{status?}");
            });
        }
    }
}