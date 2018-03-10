using arragro.com.ContentTypes.Models;
using System.Collections.Generic;

namespace www.arragro.com.Models
{
    public class ErrorPage
    {
        public List<Cloud> StartingClouds { get; set; }
        public List<Cloud> InfiniteClouds { get; set; }
        public List<CloudBannerText> CloudBannerTexts { get; set; }

        public static ErrorPage BuildNotFound()
        {
            var cloudBannerText = new List<CloudBannerText> { new CloudBannerText { Markdown = "The page you are looking for is not here" } };
            var startingClouds = new List<Cloud>();
            var infiniteClouds = new List<Cloud>();
            for (var i = 1; i < 5; i++)
            {
                startingClouds.Add(
                    new Cloud
                    {
                        Name = $"Cloud {i}"
                    });
            }
            for (var i = 1; i < 8; i++)
            {
                infiniteClouds.Add(
                    new Cloud
                    {
                        Name = $"Cloud {i}"
                    });
            }
            return new ErrorPage
            {
                CloudBannerTexts = cloudBannerText,
                StartingClouds = startingClouds,
                InfiniteClouds = infiniteClouds
            };
        }
    }
}
