using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Net;

namespace www.arragro.com.TagHelpers
{
    public class MarkdownTagHelper : TagHelper
	{
        public bool EscapeHtml { get; set; } = false;
		public string Markdown { get; set; }

		public override void Process(TagHelperContext context, TagHelperOutput output)
		{
            output.TagName = "div";
            var markdown = EscapeHtml ? WebUtility.HtmlEncode(Markdown) : Markdown;
            output.Content.SetHtmlContent(CommonMark.CommonMarkConverter.Convert(markdown.Replace("&#xA;", "\n")));
        }
	}
}