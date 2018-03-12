using Microsoft.AspNetCore.Razor.TagHelpers;
using www.arragro.com.Models;

namespace www.arragro.com.TagHelpers
{
	public class MetadataTagHelper : TagHelper
	{
		public MetaData MetaData { get; set; }

		public override void Process(TagHelperContext context, TagHelperOutput output)
		{
			var title = string.IsNullOrEmpty(MetaData.Title) ? "Arragro Software Developement for the Cloud" : $"{MetaData.Title} - Arragro";
			var description = string.IsNullOrEmpty(MetaData.Description) ? "Azure Architecture Deployment .Net ASP.Net MVC" : MetaData.Description;
			var keywords = string.IsNullOrEmpty(MetaData.Keywords) ? "Azure Architecture Deployment .Net ASP.Net MVC" : MetaData.Keywords;

			output.TagName = "";
			output.Content.SetHtmlContent($@"
      <title>{title}</title>
      <meta name=""description"" content=""{description}"" />
      <meta name=""keywords"" content=""{keywords}"" />
      <meta property=""og:title"" content=""{title}"">
      <meta property=""og:site_name"" content=""{MetaData.SiteName}"" />
      <meta property=""og:url"" content=""{MetaData.Url}"" />
      <meta property=""og:description"" content=""{description}"" />");
		}
	}
}