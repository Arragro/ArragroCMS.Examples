using ArragroCMS.Core.Web.DataTransformationObjects;

namespace www.arragro.com.Models
{
    public class MetaData
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Keywords { get; set; }
        public string SiteName { get; set; }
        public string Url { get; set; }

        private MetaData(string siteName, string url)
        {
            SiteName = siteName;
            Url = url;
        }

        public MetaData(ContentDtoBase content) : this("Arragro", "https://arragro.com")
        {
            var title = string.IsNullOrEmpty(content.Title) ? "Arragro Software Developement for the Cloud" : $"{content.Title} - Arragro";
            //var description = string.IsNullOrEmpty(content.Description) ? "Azure Architecture Deployment .Net ASP.Net MVC" : content.Description;
            //var keywords = string.IsNullOrEmpty(content.Keywords) ? "Azure Architecture Deployment .Net ASP.Net MVC" : content.Keywords;

            Title = title;
            //Description = description;
            //Keywords = keywords;
        }

        public MetaData(string siteName, string url, ContentDtoBase content) : this(siteName, url)
        {
            var title = string.IsNullOrEmpty(content.Title) ? "Arragro Software Developement for the Cloud" : $"{content.Title} - Arragro";
            //var description = string.IsNullOrEmpty(content.Description) ? "Azure Architecture Deployment .Net ASP.Net MVC" : content.Description;
            //var keywords = string.IsNullOrEmpty(content.Keywords) ? "Azure Architecture Deployment .Net ASP.Net MVC" : content.Keywords;

            Title = title;
            //Description = description;
            //Keywords = keywords;
        }

        public MetaData(string title, string description, string keywords) : this("Arragro", "https://arragro.com")
        {
            Title = title;
            Description = description;
            Keywords = keywords;
        }

        public MetaData(string siteName, string url, string title, string description, string keywords) : this(siteName, url)
        {
            Title = title;
            Description = description;
            Keywords = keywords;
        }
    }
}
