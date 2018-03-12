using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.IO;

namespace www.arragro.com.TagHelpers
{
    public class StandardHeaderTagHelper : TagHelper
    {
        public string Title { get; set; }
        public string CloudSrc { get; set; } = "/images/svgs/cloud-shadow.svg";

        private TagBuilder GetClouds(string className, int count)
        {
            var startingClouds = new TagBuilder("div");
            startingClouds.AddCssClass(className);

            for (var i = 0; i < count; i++)
            {
                using (var writer = new StringWriter())
                {
                    var cloudClassName = $"cloud-wrapper-{i + 1}";
                    var tagBuilder = new TagBuilder("div");
                    tagBuilder.Attributes.Add("class", cloudClassName);

                    tagBuilder.InnerHtml.AppendHtml($@"
<div class='cloud-{i + 1}'>
    <div class='cloud'>
        <img src='{CloudSrc}' alt='Cloud' />
    </div>
</div>");
                    tagBuilder.TagRenderMode = TagRenderMode.Normal;

                    startingClouds.InnerHtml.AppendHtml(tagBuilder);
                }
            }

            return startingClouds;
        }

        public TagBuilder GetTitle()
        {
            var tagBuilder = new TagBuilder("div");
            tagBuilder.AddCssClass("banner-text d-flex align-items-center justify-content-center");
            tagBuilder.InnerHtml.AppendHtml($"<h1>{Title}</h1>");

            tagBuilder.TagRenderMode = TagRenderMode.Normal;

            return tagBuilder;
        }
        
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = "header";
            output.Attributes.Add(new TagHelperAttribute("id", "standardHeader"));

            var tagBuilder = new TagBuilder("div");
            tagBuilder.AddCssClass("background-wrap");

            tagBuilder.InnerHtml.AppendHtml(GetClouds("starting-clouds", 4));
            tagBuilder.InnerHtml.AppendHtml(GetClouds("infinite-clouds", 6));
            tagBuilder.InnerHtml.AppendHtml(GetTitle());

            tagBuilder.TagRenderMode = TagRenderMode.Normal;
            
            output.Content.AppendHtml(tagBuilder);
            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
