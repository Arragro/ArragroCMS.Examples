using arragro.com.ContentTypes.Models;
using Arragro.Core.Web.Helpers;
using ArragroCMS.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json;
using Polly;
using System;
using System.Threading.Tasks;

namespace www.arragro.com.Controllers
{
    public class ContactController : Controller
    {
        private readonly ILogger<ContactController> _log;
        private readonly ConfigurationSettings _configurationSettings;

        public ContactController(ILogger<ContactController> log, ConfigurationSettings configurationSettings)
        {
            _configurationSettings = configurationSettings;
            _log = log;
        }

        public IActionResult Index()
        {
            return View();
        }

        private async Task SendContactFormQueueMessage(Uri blobUri)
        {
            try
            {
                await Policy
                    .Handle<Exception>()
                    .RetryAsync(3)
                    .ExecuteAsync(async () =>
                    {
                        var storageAccount = CloudStorageAccount.Parse(_configurationSettings.ArragroCmsOptions.StorageAccountConnectionString);
                        var queueClient = storageAccount.CreateCloudQueueClient();
                        var queue = queueClient.GetQueueReference("contact-form");
                        await queue.CreateIfNotExistsAsync();

                        var message = new CloudQueueMessage(blobUri.ToString());
                        await queue.AddMessageAsync(message);
                    });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "ContactController: Something went wrong in SendContactFormQueueMessage", blobUri);
                throw;
            }
        }

        private async Task<Uri> SaveContactForm(ContactForm contactForm)
        {
            try
            {
                return await Policy
                    .Handle<Exception>()
                    .RetryAsync(3)
                    .ExecuteAsync(async () =>
                    {
                        var storageAccount = CloudStorageAccount.Parse(_configurationSettings.ArragroCmsOptions.StorageAccountConnectionString);
                        var blobClient = storageAccount.CreateCloudBlobClient();
                        var container = blobClient.GetContainerReference("contact-form");
                        await container.CreateIfNotExistsAsync(Microsoft.WindowsAzure.Storage.Blob.BlobContainerPublicAccessType.Blob, new BlobRequestOptions(), new OperationContext());

                        var blob = container.GetBlockBlobReference($"{DateTime.UtcNow.ToString("yyyy-MM-dd")}-{DateTime.UtcNow.Ticks}.json");
                        await blob.UploadTextAsync(JsonConvert.SerializeObject(contactForm));
                        return blob.Uri;
                    });
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "ContactController: Something went wrong in SaveContactForm", contactForm);
                throw;
            }
        }

        [ValidateAntiForgeryToken]
        [HttpPost("/api/contact")]
        public async Task<IActionResult> PostContactForm([FromForm] ContactForm contactForm)
        {
            if (GoogleRecaptcha.Validate(contactForm.RecapchtaResponse, _configurationSettings.GoogleOptions.Recaptcha.Secret))
            {
                var blobUri = await SaveContactForm(contactForm);
                await SendContactFormQueueMessage(blobUri);                

                return new JsonResult(new { Result = true });
            }

            return new JsonResult(new { Result = false, Message = "Recaptcha failed to validate" });
        }
    }
}