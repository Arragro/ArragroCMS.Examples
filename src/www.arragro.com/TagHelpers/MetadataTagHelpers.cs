using ArragroCMS.Core.Web.DataTransformationObjects;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace www.arragro.com.TagHelpers
{
    public class MetadataTagHelper : TagHelper
    {
        public string SiteName { get; set; }
        public string Url { get; set; }
        public ContentDtoJsonAsObject Content { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            var title = string.IsNullOrEmpty(Content.Title) ? "Arragro Software Developement for the Cloud" : $"{Content.Title} - Arragro";
            var description = string.IsNullOrEmpty(Content.Description) ? "Azure Architecture Deployment .Net ASP.Net MVC" : Content.Description;
            var keywords = string.IsNullOrEmpty(Content.Keywords) ? "Azure Architecture Deployment .Net ASP.Net MVC" : Content.Keywords;

            output.TagName = "";
            output.Content.SetHtmlContent($@"
      <title>{title}</title>
      <meta name=""description"" content=""{description}"" />
      <meta name=""keywords"" content=""{keywords}"" />
      <meta property=""og:title"" content=""{title}"">
      <meta property=""og:site_name"" content=""{SiteName}"" />
      <meta property=""og:url"" content=""{Url}"" />
      <meta property=""og:description"" content=""{description}"" />");
        }
    }
}
