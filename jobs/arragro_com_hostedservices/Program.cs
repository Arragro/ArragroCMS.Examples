using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Sinks.SystemConsole.Themes;
using System.IO;

namespace arragro_com_hostedservices
{
    public static class Extentions
    {
        public static IServiceCollection AddCustomHealthCheck(this IServiceCollection services, IConfiguration configuration)
        {
            var hcBuilder = services.AddHealthChecks();

            hcBuilder.AddCheck("self", () => HealthCheckResult.Healthy());

            hcBuilder.AddSendGrid(configuration["ApplicationSettings:SendGridApiKey"]);
            hcBuilder.AddAzureBlobStorage(configuration["ConnectionStrings:StorageConnection"]);
            hcBuilder.AddAzureQueueStorage(configuration["ConnectionStrings:StorageConnection"], "contact-form");

            //hcBuilder.AddNpgSql(
            //        configuration["ConnectionStrings:CmsDatabaseConnection"],
            //        name: "ArragroCMS.Jobs.DB-check",
            //        tags: new string[] { "ArragroCMS.Jobs.DB" });


            return services;
        }

        public static ILoggingBuilder UseSerilog(this ILoggingBuilder builder, IConfiguration configuration)
        {
            //var seqServerUrl = configuration["Serilog:SeqServerUrl"];
            //var logstashUrl = configuration["Serilog:LogstashgUrl"];

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Verbose()
                .Enrich.WithProperty("ApplicationContext", Program.AppName)
                .Enrich.FromLogContext()
                .WriteTo.Console(theme: AnsiConsoleTheme.Code)
                //.WriteTo.Seq(string.IsNullOrWhiteSpace(seqServerUrl) ? "http://seq" : seqServerUrl)
                //.WriteTo.Http(string.IsNullOrWhiteSpace(logstashUrl) ? "http://logstash:8080" : logstashUrl)
                .ReadFrom.Configuration(configuration)
                .CreateLogger();

            return builder;
        }
    }

    public class Program
    {
        public static readonly string AppName = typeof(Program).Assembly.GetName().Name;

        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Run();
        }

        public static IHost CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => webBuilder.UseStartup<Startup>())
                .ConfigureAppConfiguration((host, builder) =>
                {
                    builder.SetBasePath(Directory.GetCurrentDirectory());
                    builder.AddJsonFile("appsettings.json", optional: true);
                    builder.AddJsonFile($"appsettings.{host.HostingEnvironment.EnvironmentName}.json", optional: true);
                    builder.AddEnvironmentVariables();
                    builder.AddCommandLine(args);
                })
                .ConfigureLogging((host, builder) => {
                    builder.ClearProviders();
                    builder.AddApplicationInsights(host.Configuration.GetValue<string>("ApplicationInsights:InstrumentationKey"));
                    builder.UseSerilog(host.Configuration).AddSerilog();
                })
                .Build();
    }
}
