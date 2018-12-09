using System.Threading.Tasks;
using arragro.com.functions.Helpers;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace arragro.com.functions
{
    public static class ContactFormFunction
    {
        [FunctionName("ProcessContactFormMessage")]
        public static async Task Run(
            [QueueTrigger("contact-form")] string url,
            ILogger log, ExecutionContext context)
        {
            log.LogInformation($"ProcessContactFormMessage: {url}");

            var azureStorageHelper = new AzureStorageHelper(context.GetStorageConnectionString());
            var contactForm = await azureStorageHelper.GetContactForm(url);
            var sendgridHelper = new SendGridHelper(context.GetSengridKey());
            await sendgridHelper.SendContactFormMessage(url, contactForm);
        }
    }
}
