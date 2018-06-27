using Arragro.Core.Common.Models;
using ArragroCMS.Management.Extensions;
using ArragroCMS.Web.Data;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using StackExchange.Redis;
using System;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;

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
        public void ConfigureServices(IServiceCollection services)
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

            
            //var assembly = typeof(Startup).GetTypeInfo().Assembly;
            //var bytes = ReadStreamAsBytes(assembly.GetManifestResourceStream("www.arragro.com.Resources.test-cert.pfx"));
            //X509Certificate2 x509Cert = new X509Certificate2(bytes, "password");

            // var redis = ConnectionMultiplexer.Connect(Configuration.GetConnectionString("RedisConnection"));

            //services.AddDataProtection()
            //    .PersistKeysToRedis(redis, "DataProtection-Keys")
            //    .ProtectKeysWithCertificate(x509Cert);

            services.Configure<GzipCompressionProviderOptions>
                (options => options.Level = CompressionLevel.Fastest);

            services.AddResponseCompression(options =>
            {
                options.Providers.Add<GzipCompressionProvider>();
            });

            services.AddMvc();
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