using Arragro.Core.Email.Razor.Services;
using Arragro.Core.HostedServices;
using HealthChecks.UI.Client;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Reflection;

namespace arragro_com_hostedservices
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public virtual void ConfigureServices(IServiceCollection services)
        {
            services.AddCustomHealthCheck(Configuration)
                .AddQueueJob<ContactFormEmailQueueService>(
                    Configuration["ConnectionStrings:StorageConnection"],
                    "contact-form");

            var tempTelemetaryPath = $"{Directory.GetCurrentDirectory()}/App_Data/app-insights";
            if (!Directory.Exists(tempTelemetaryPath))
                Directory.CreateDirectory(tempTelemetaryPath);

            services.AddSingleton(typeof(ITelemetryChannel),
                                new ServerTelemetryChannel() { StorageFolder = tempTelemetaryPath });

            var mvcBuilder = RazorViewToStringRenderer.ConfigureAndGetNoLogging(services, Assembly.GetExecutingAssembly().Location);
            var serviceCollection = mvcBuilder.Services;
            serviceCollection
                    .AddApplicationInsightsTelemetryWorkerService(Configuration.GetValue<string>("ApplicationInsights:InstrumentationKey"));
        }


        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
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
            });
        }
    }
}
