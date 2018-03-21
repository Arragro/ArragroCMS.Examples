using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.IO;

namespace www.arragro.com.TagHelpers
{
    public class StandardHeaderTagHelper : TagHelper
    {
        public string Title { get; set; }
        public string CloudSrc { get; set; } = "/images/svgs/cloud-shadow.svg";

        private TagBuilder GetClouds(int count, bool starting = false)
        {
            var clouds = new TagBuilder("div");

            for (var i = 0; i < count; i++)
            {
                using (var writer = new StringWriter())
                {
                    var cloudClassName = $"cloud-wrapper-{i + 1}";
                    var tagBuilder = new TagBuilder("div");
                    tagBuilder.Attributes.Add("class", cloudClassName);
                    if (starting)
                        tagBuilder.AddCssClass("start");

                    tagBuilder.InnerHtml.AppendHtml($@"
<div class='cloud-{i + 1}'>
    <div class='cloud'>
        <img src='{CloudSrc}' alt='Cloud' />
    </div>
</div>");
                    tagBuilder.TagRenderMode = TagRenderMode.Normal;

                    clouds.InnerHtml.AppendHtml(tagBuilder);
                }
            }

            return clouds;
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

            var infiniteClouds = new TagBuilder("div");
            infiniteClouds.AddCssClass("infinite-clouds");

            infiniteClouds.InnerHtml.AppendHtml(GetClouds(4, true));
            infiniteClouds.InnerHtml.AppendHtml(GetClouds(6));
            tagBuilder.InnerHtml.AppendHtml(infiniteClouds);
            tagBuilder.InnerHtml.AppendHtml(GetTitle());

            tagBuilder.TagRenderMode = TagRenderMode.Normal;
            
            output.Content.AppendHtml(tagBuilder);
            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
