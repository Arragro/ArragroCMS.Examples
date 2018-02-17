using arragro.com.ContentTypes.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor.TagHelpers;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace www.arragro.com.TagHelpers
{
    public class CloudsTagHelper : TagHelper
    {
        public List<Cloud> Clouds { get; set; }
        public bool Starting { get; set; } = false;
        public string ClassName { get; set; }

        private TagBuilder GetCloud(Cloud cloud, int index)
        {
            var className = $"cloud-{index + 1}";
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
    <img src='/images/svgs/cloud.svg' alt='Cloud' />
    <div class='cloud-image'><img src='{cloud.ImageUrl}' alt='{cloud.ImageUrlAlt}' /></div>
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
