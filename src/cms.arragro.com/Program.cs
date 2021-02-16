using Arragro.Core.Common.Enums;
using ArragroCMS.BusinessLayer.Data.EFCore;
using ArragroCMS.Core.Enums;
using ArragroCMS.Core.Models;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;
using Serilog.Filters;
using Serilog.Sinks.SystemConsole.Themes;
using System.IO;

namespace cms.arragro.com
{
    public static class Extentions
    {
        public static IServiceCollection AddCustomHealthCheck(this IServiceCollection services, ConfigurationSettings configurationSettings)
        {
            var hcBuilder = services.AddHealthChecks();

            hcBuilder.AddCheck("self", () => HealthCheckResult.Healthy());

            switch (configurationSettings.ApplicationSettings.DatabaseType)
            {
                case DatabaseType.Postgres:
                    hcBuilder.AddDbContextCheck<ArragroCmsPGContext>();
                    hcBuilder.AddDbContextCheck<ArragroCmsIdentityPGContext>();
                    break;
                case DatabaseType.Sqlite:
                    hcBuilder.AddDbContextCheck<ArragroCmsSqliteContext>();
                    hcBuilder.AddDbContextCheck<ArragroCmsIdentitySqliteContext>();
                    break;
                default:
                    hcBuilder.AddDbContextCheck<ArragroCmsContext>();
                    hcBuilder.AddDbContextCheck<ArragroCmsIdentityContext>();
                    break;
            }
            //hcBuilder.AddDbContextCheck<ArragroCmsIdentityBaseContext>();

            //hcBuilder.AddNpgSql(
            //        configuration["ConnectionStrings:CmsDatabaseConnection"],
            //        name: "ArragroCMS.Jobs.DB-check",
            //        tags: new string[] { "ArragroCMS.Jobs.DB" });

            if (configurationSettings.DistributedCacheSettings.DistributedCacheType == DistributedCacheType.Redis)
                hcBuilder.AddRedis(configurationSettings.DistributedCacheSettings.ConfigurationNameOrConnectionString);

            //hcBuilder.AddSendGrid()
            hcBuilder.AddAzureBlobStorage(configurationSettings.ConnectionStrings.StorageConnection);
            hcBuilder.AddAzureQueueStorage(configurationSettings.ConnectionStrings.StorageConnection, "arragro-cms-examples-emails");

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
            // Create the logger
            Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .WriteTo.Logger(lc => lc
                    .MinimumLevel.Information()
                    .Filter.ByExcluding(Matching.FromSource("Microsoft.EntityFrameworkCore"))
                    .WriteTo.ColoredConsole(
                        LogEventLevel.Information,
                        "{NewLine}{Timestamp:HH:mm:ss} [{Level}] ({CorrelationToken}) {Message}{NewLine}{Exception}"))
                .WriteTo.Logger(lc => lc
                    .MinimumLevel.Verbose()
                    .WriteTo.RollingFile("App_Data\\Logs\\log-{Date}.txt", fileSizeLimitBytes: 536870912, retainedFileCountLimit: 7)
                )                
                .CreateLogger();

            try
            {
                CreateWebHostBuilder(args).Build().Run();
            }
            finally
            {
                // Close and flush the log.
                Log.CloseAndFlush();
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((host, builder) =>
                {
                    builder.SetBasePath(Directory.GetCurrentDirectory());
                    builder.AddJsonFile("appsettings.json", optional: true);
                    builder.AddJsonFile($"appsettings.{host.HostingEnvironment.EnvironmentName}.json", optional: true);
                    builder.AddEnvironmentVariables();
                    builder.AddCommandLine(args);
                    builder.AddUserSecrets<Startup>();
                })
                .ConfigureLogging((host, builder) => 
                {
                    builder.ClearProviders();
                    if (host.Configuration["ApplicationInsights:InstrumentationKey"] != null)
                        builder.AddApplicationInsights(host.Configuration["ApplicationInsights:InstrumentationKey"]);
                    builder.UseSerilog(host.Configuration).AddSerilog();
                })
                .UseStartup<Startup>();
    }
}
