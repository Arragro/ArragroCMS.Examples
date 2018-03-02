using System;
using System.Configuration;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using arragro.com.ContentTypes.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace arragro.com.functions
{
    public static class ContactFormFunction
    {
        public static string GetEnvironmentVariable(string name)
        {
            return name + ": " +
                System.Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Process);
        }

        private static object _locker = new object();
        private static IConfigurationRoot _configurationBuilder = null;

        static IConfigurationRoot GetConfiguration(ExecutionContext context)
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

        [FunctionName("ProcessContactFormMessage")]
        public static async Task ProcessContactFormMessage([QueueTrigger("contact-form", Connection = "")]string url, TraceWriter log, ExecutionContext context)
        {
            log.Info($"ProcessContactFormMessage: {url}");

            var configuration = GetConfiguration(context);
            var azureWebJobsStorage = configuration["AzureWebJobsStorage"];
            
            var storageAccount = CloudStorageAccount.Parse(azureWebJobsStorage);
            var blobClient = storageAccount.CreateCloudBlobClient();
            var blob = await blobClient.GetBlobReferenceFromServerAsync(new Uri(url));
            if (await blob.ExistsAsync())
            {
                using (var ms = new MemoryStream())
                {
                    await blob.DownloadToStreamAsync(ms);
                    ms.Position = 0;
                    var reader = new StreamReader(ms);
                    var text = reader.ReadToEnd();

                    var contactForm = JsonConvert.DeserializeObject<ContactForm>(text);
                    ms.Position = 0;

                    var fullName = $"{contactForm.FirstName} {contactForm.LastName}";
                    var message = new SendGridMessage();
                    message.AddTo("enquiries@arragro.com");
                    message.From = new EmailAddress(contactForm.Email, fullName);
                    message.Subject = $"You have an enquiry from {fullName}";
                    message.PlainTextContent = "See Attachment";
                    message.HtmlContent = $@"
<h1>Enquiry</h1>
<a href='{url}'>Click to download</a>
<ul>
    <li>{fullName}</li>
    <li>{contactForm.Company}</li>
    <li>{contactForm.Email}</li>
    <li>{contactForm.Phone}</li>
    <li>{contactForm.Message}</li>
</ul>";
                    
                    var sendgridKey = configuration["SendgridKey"];
                    var sendGridClient = new SendGridClient(sendgridKey);
                    var response = await sendGridClient.SendEmailAsync(message);
                    if (response.StatusCode !=System.Net.HttpStatusCode.Accepted)
                    {
                        throw new Exception("Something went wrong sending the email");
                    }
                }
            }
            else
            {
                throw new Exception("There is no file to process");
            }
        }
    }
}
