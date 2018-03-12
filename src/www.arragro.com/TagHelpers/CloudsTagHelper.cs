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
        public List<Tile> Clouds { get; set; }
        public string ClassName { get; set; }
        public string CloudSrc { get; set; } = "/images/svgs/cloud-shadow.svg";

        private TagBuilder GetCloud(Tile cloud, int index)
        {
            var className = $"cloud-wrapper-{index + 1}";
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
<div class='cloud-{index + 1}'>
    <div class='cloud'>
        <img src='{CloudSrc}' alt='Cloud' />
        {(cloud.ImageUrl != null && cloud.ImageUrl.Length > 0 ? $"<div class='cloud-image'><img src='{cloud.ImageUrl}' alt='{cloud.ImageUrlAlt}' /></div>" : "")}
    </div>
</div>");

            tagBuilder.TagRenderMode = TagRenderMode.Normal;

            return tagBuilder;
        }
        
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "div";
            output.Attributes.Add(new TagHelperAttribute("class", ClassName));

            var html = string.Empty;
            for (var i = 0; i < Clouds.Count; i++)
            {
                using (var writer = new StringWriter())
                {
                    GetCloud(Clouds[i], i).WriteTo(writer, HtmlEncoder.Default);
                    html += writer.ToString();
                }
            }

            output.Content.SetHtmlContent(html);
            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
