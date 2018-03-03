using System.Threading.Tasks;
using arragro.com.functions.Helpers;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;

namespace arragro.com.functions
{
    public static class ContactFormFunction
    {
        [FunctionName("ProcessContactFormMessage")]
        public static async Task ProcessContactFormMessage(
            [QueueTrigger("contact-form", Connection = "")]string url,
            TraceWriter log, ExecutionContext context)
        {
            log.Info($"ProcessContactFormMessage: {url}");

            var azureStorageHelper = new AzureStorageHelper(context.GetStorageConnectionString());
            var contactForm = await azureStorageHelper.GetContactForm(url);
            var sendgridHelper = new SendGridHelper(context.GetSengridKey());
            await sendgridHelper.SendContactFormMessage(url, contactForm);
        }
    }
}
