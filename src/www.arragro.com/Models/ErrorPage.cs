using arragro.com.ContentTypes.Models;
using System.Collections.Generic;

namespace www.arragro.com.Models
{
    public class ErrorPage
    {
        public List<Tile> StartingClouds { get; set; }
        public List<Tile> InfiniteClouds { get; set; }
        public List<CloudBannerText> CloudBannerTexts { get; set; }

        private static ErrorPage BuildClouds(ErrorPage errorPage)
        {
            var startingClouds = new List<Tile>();
            var infiniteClouds = new List<Tile>();
            for (var i = 1; i < 5; i++)
            {
                startingClouds.Add(
                    new Tile
                    {
                        Name = $"Cloud {i}"
                    });
            }
            for (var i = 1; i < 8; i++)
            {
                infiniteClouds.Add(
                    new Tile
                    {
                        Name = $"Cloud {i}"
                    });
            }

            errorPage.StartingClouds = startingClouds;
            errorPage.InfiniteClouds = infiniteClouds;

            return errorPage;
        }

        public static ErrorPage BuildNotFound()
        {
            var cloudBannerText = new List<CloudBannerText> { new CloudBannerText { Markdown = "The page you are looking for is not here" } };
            
            return BuildClouds(new ErrorPage
            {
                CloudBannerTexts = cloudBannerText
            });
        }

        public static ErrorPage BuildError()
        {
            var cloudBannerText = new List<CloudBannerText> { new CloudBannerText { Markdown = "Unfortunately something has gone wrong" } };

            return BuildClouds(new ErrorPage
            {
                CloudBannerTexts = cloudBannerText
            });
        }
    }
}
