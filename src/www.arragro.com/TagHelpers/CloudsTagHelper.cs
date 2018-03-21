using arragro.com.ContentTypes.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Collections.Generic;
using System.IO;
using System.Text.Encodings.Web;

namespace www.arragro.com.TagHelpers
{
    public class CloudsTagHelper : TagHelper
    {
        public List<Tile> StartingClouds { get; set; }
        public List<Tile> InfiniteClouds { get; set; }
        public string ClassName { get; set; }
        public string CloudSrc { get; set; } = "/images/svgs/cloud-shadow.svg";

        private TagBuilder GetCloud(Tile cloud, int index, bool starter = false)
        {
            var cloudWrapper = new TagBuilder("div");
            cloudWrapper.AddCssClass($"cloud-wrapper-{index + 1}");
            if (starter)
                cloudWrapper.AddCssClass("start");

            var cloudContainer = new TagBuilder(cloud.HasLink ? "a" : "div");

            if (!string.IsNullOrWhiteSpace(cloud.CssClass))
                cloudContainer.AddCssClass(cloud.CssClass);

            if (cloud.HasLink)
            {
                cloudContainer.Attributes.Add("href", cloud.Href);
                cloudContainer.Attributes.Add("target", "_self");
                if (!string.IsNullOrEmpty(cloud.LinkText))
                {
                    cloudContainer.Attributes.Add("alt", cloud.LinkText);
                }
            }

            cloudContainer.InnerHtml.AppendHtml($@"
<div class='cloud'>
    <img src='{CloudSrc}' alt='Cloud' />
    {(cloud.ImageUrl != null && cloud.ImageUrl.Length > 0 ? $"<div class='cloud-image'><img src='{cloud.ImageUrl}' alt='{cloud.ImageUrlAlt}' /></div>" : "")}
</div>");

            cloudWrapper.InnerHtml.AppendHtml(cloudContainer);
            cloudWrapper.TagRenderMode = TagRenderMode.Normal;

            return cloudWrapper;
        }
        
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "div";
            output.Attributes.Add(new TagHelperAttribute("class", ClassName));

            var html = string.Empty;
            for (var i = 0; i < InfiniteClouds.Count; i++)
            {
                using (var writer = new StringWriter())
                {
                    GetCloud(InfiniteClouds[i], i).WriteTo(writer, HtmlEncoder.Default);
                    html += writer.ToString();
                }
            }
            for (var i = 0; i < StartingClouds.Count; i++)
            {
                using (var writer = new StringWriter())
                {
                    GetCloud(StartingClouds[i], i, true).WriteTo(writer, HtmlEncoder.Default);
                    html += writer.ToString();
                }
            }

            output.Content.SetHtmlContent(html);
            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
