using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Configuration;

namespace arragro.com.functions.Helpers
{
    public static class ConfigurationHelper
    {
        private static object _locker = new object();
        private static IConfigurationRoot _configurationBuilder = null;

        private static IConfigurationRoot GetConfiguration(this ExecutionContext context)
        {
            if (_configurationBuilder == null)
            {
                lock (_locker)
                {
                    if (_configurationBuilder == null)
                    {
                        _configurationBuilder = new ConfigurationBuilder()
                           .SetBasePath(context.FunctionAppDirectory)
                           .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                           .AddEnvironmentVariables()
                           .Build();
                    }
                }
            }
            return _configurationBuilder;
        }

        public static string GetStorageConnectionString(this ExecutionContext context)
        {
            return context.GetConfiguration()["AzureWebJobsStorage"];
        }

        public static string GetSengridKey(this ExecutionContext context)
        {
            return context.GetConfiguration()["SendgridKey"];
        }        
    }
}
