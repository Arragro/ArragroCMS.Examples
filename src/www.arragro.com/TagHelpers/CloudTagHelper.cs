using arragro.com.ContentTypes.Models;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Threading.Tasks;

namespace www.arragro.com.TagHelpers
{
    public class CloudTagHelper : TagHelper
    {
        public int Index { get; set; }
        public Tile Cloud { get; set; }
        
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            var className = $"cloud-{Index + 1}";

            if (Cloud.HasLink)
            {
                output.TagName = "a";
                output.Attributes.Add(new TagHelperAttribute("href", Cloud.Href));
                output.Attributes.Add(new TagHelperAttribute("target", "_blank"));
                if (!string.IsNullOrEmpty(Cloud.LinkText))
                {
                    output.Attributes.Add(new TagHelperAttribute("alt", Cloud.LinkText));
                }
            }
            else
            {
                output.TagName = "div";
            }
            output.Attributes.Add(new TagHelperAttribute("class", className));

            output.Content.SetHtmlContent($@"
    <div class='cloud'>
        <img src='/images/svgs/cloud-shadow.svg' alt='Cloud' />
        {(Cloud.ImageUrl.Length > 0 ? $"<div class='cloud-image'><img src='{Cloud.ImageUrl}' alt='{Cloud.ImageUrlAlt}' /></div>" : "")}
    </div>");
            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
