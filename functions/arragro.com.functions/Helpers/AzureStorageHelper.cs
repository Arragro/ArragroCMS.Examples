using arragro.com.ContentTypes.Models;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading.Tasks;

namespace arragro.com.functions.Helpers
{
    public class AzureStorageHelper
    {
        private readonly string _connectionString;

        public AzureStorageHelper(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<ContactForm> GetContactForm(string url)
        {
            var storageAccount = CloudStorageAccount.Parse(_connectionString);
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
                    ms.Close();
                    ms.Dispose();
                    return contactForm;
                }
            }
            else
            {
                throw new Exception($"There is no file to process at - {url}");
            }
        }
    }
}
