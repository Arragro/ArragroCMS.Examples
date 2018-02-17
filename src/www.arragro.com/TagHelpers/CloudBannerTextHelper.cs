using arragro.com.ContentTypes.Models;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace www.arragro.com.TagHelpers
{
    public class CloudBannerTextTagHelper : TagHelper
    {
        public List<CloudBannerText> CloudBannerTexts { get; set; }
        public string ClassName { get; set; }
        public int Interval { get; set; } = 3000;

        private string GetBannerText(CloudBannerText cloudBannerText, int index, bool active)
        {
            var className = $"carousel-item {(active ? "active" : "")}";

            return $@"
<div class='{className}'>
    <h1>{CommonMark.CommonMarkConverter.Convert(cloudBannerText.Markdown.Replace("&#xA;", "\n"))}</h1>
</div>";
        }

        private string GetBannerTexts()
        {
            var sb = new StringBuilder();
            for (var i = 0; i < CloudBannerTexts.Count; i++)
            {
                var cloudBannerText = CloudBannerTexts[i];
                sb.AppendLine(GetBannerText(cloudBannerText, i, i == 0));
            }
            return sb.ToString();
        }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "div";
            output.Attributes.Add(new TagHelperAttribute("class", ClassName));


            var html = $@"
<div id='carousel-cloud-banner-text' class='carousel slide carousel-fade d-flex align-items-center justify-content-center' data-ride='carousel' data-interval='{Interval}'>
    <div class='carousel-inner' role='list-box'>
        {GetBannerTexts()}  
    </div>
</div>";

            output.Content.SetHtmlContent(html);
            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
