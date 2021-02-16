using arragro.com.functions.Helpers;
using Arragro.Core.HostedServices;
using arragro_com_hostedservices.Helpers;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Queues.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace arragro_com_hostedservices
{
    public class Message
    {
        public string Name { get; set; }
    }

    public class ContactFormEmailQueueService : QueueJobService
    {
        private readonly IQueueConfig<ContactFormEmailQueueService> _config;
        private readonly IConfiguration _configuration;

        public ContactFormEmailQueueService(
            IQueueConfig<ContactFormEmailQueueService> config,
            ILogger<ContactFormEmailQueueService> logger,
            IConfiguration configuration)
            : base(config.QueueName, config.ConnectionString, config.CronExpression, config.IncludeSeconds, config.TimeZoneInfo, logger)
        {
            _config = config;
            _configuration = configuration;
        }

        public override async Task DoWork(QueueMessage message, CancellationToken cancellationToken)
        {
            byte[] data = Convert.FromBase64String(message.MessageText);
            string decodedString = Encoding.UTF8.GetString(data);
            var blob = JsonConvert.DeserializeObject<Message>(decodedString);
            var azureStorageHelper = new AzureStorageHelper(_config.ConnectionString);
            var contactForm = await azureStorageHelper.GetContactForm(blob);
            var sendgridHelper = new SendGridHelper(_configuration["ApplicationSettings:SendGridApiKey"]);
            await sendgridHelper.SendContactFormMessage(contactForm);
        }
    }
}
