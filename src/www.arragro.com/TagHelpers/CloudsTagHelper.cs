using arragro.com.ContentTypes.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace www.arragro.com.TagHelpers
{
    public class CloudsTagHelper : TagHelper
    {
        public List<Cloud> Clouds { get; set; }
        public List<CloudBannerText> CloudBannerTexts { get; set; }

        private string GetBannerText(CloudBannerText cloudBannerText, int index)
        {
            var className = $"x-text-{index}";

            return $@"
<div class='{className}'>
    <h1>{CommonMark.CommonMarkConverter.Convert(WebUtility.HtmlEncode(cloudBannerText.Markdown).Replace("&#xA;", "\n"))}</h1>
</div>";
        }

        private string GetBannerTexts()
        {
            var sb = new StringBuilder();
            for (var i = 0; i < CloudBannerTexts.Count; i++)
            {
                var cloudBannerText = CloudBannerTexts[i];
                sb.AppendLine(GetBannerText(cloudBannerText, i));
            }
            return sb.ToString();
        }

        private TagBuilder GetCloud(Cloud cloud, int index)
        {
            var className = $"x{index}-starting";
            var tagBuilder = new TagBuilder(cloud.HasLink ? "a" : "div");
            tagBuilder.Attributes.Add("class", className);

            if (cloud.HasLink)
            {
                tagBuilder.Attributes.Add("href", cloud.Href);
                tagBuilder.Attributes.Add("target", "_blank");
                if (!string.IsNullOrEmpty(cloud.LinkText))
                {
                    tagBuilder.Attributes.Add("alt", cloud.LinkText);
                }
            }

            tagBuilder.InnerHtml.AppendHtml($@"
<div class='cloud'>
    <img src='~/images/svgs/cloud.svg' alt='Cloud' />
    <div class='cloud-image'><img src='${cloud.ImageUrl}' alt='${cloud.ImageUrlAlt}'</div>
</div>");

            tagBuilder.TagRenderMode = TagRenderMode.SelfClosing;

            return tagBuilder;
        }
        
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "div";

            var html = string.Empty;
            if (Clouds.Count == 0)
            {
                html = GetBannerTexts();
            }
            else if (Clouds.Count == 1)
            {
                html = GetCloud(Clouds[0], 1).ToString();
                html += GetBannerTexts();
            }
            else
            {
                for (var i = 0; i < Clouds.Count; i++)
                {
                    html += GetCloud(Clouds[0], 1).ToString();

                    if (i == 2)
                    {
                        html += GetBannerTexts();
                    }
                }
            }

            output.Content.SetHtmlContent(html);
            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
