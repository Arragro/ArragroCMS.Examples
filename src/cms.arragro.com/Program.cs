using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore;
using Serilog;
using Serilog.Events;
using Serilog.Filters;

namespace cms.arragro.com
{
    public class Program
    {
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
                .UseSerilog()
                .UseStartup<Startup>()
                .UseApplicationInsights();
    }
}
