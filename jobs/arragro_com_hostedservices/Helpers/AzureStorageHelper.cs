using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading.Tasks;

namespace arragro_com_hostedservices.Helpers
{
    public class AzureStorageHelper
    {
        private readonly string _connectionString;

        public AzureStorageHelper(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<ContactForm> GetContactForm(Message blob)
        {
            var blobClient = new BlobClient(_connectionString, "contact-form", blob.Name);

            if (await blobClient.ExistsAsync())
            {
                BlobDownloadInfo download = await blobClient.DownloadAsync();

                using (var ms = new MemoryStream())
                {
                    await download.Content.CopyToAsync(ms);
                    ms.Position = 0;
                    var reader = new StreamReader(ms);
                    var text = reader.ReadToEnd();

                    var contactForm = JsonConvert.DeserializeObject<ContactForm>(text);
                    ms.Close();
                    ms.Dispose();
                    contactForm.Url = blobClient.Uri.ToString();
                    return contactForm;
                }
            }
            else
            {
                throw new Exception($"There is no file to process at - {blobClient.Uri}");
            }
        }
    }
}
