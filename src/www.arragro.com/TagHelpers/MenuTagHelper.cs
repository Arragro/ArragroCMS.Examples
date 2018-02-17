using ArragroCMS.Core.Web.DataTransformationObjects;
using ArragroCMS.Web.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace www.arragro.com.TagHelpers
{
    public class MenuTagHelper : TagHelper
    {
        private readonly IArragroCmsManagementClient _arragroCmsManagementClient;

        public MenuTagHelper(
            IArragroCmsManagementClient arragroCmsManagementClient)
        {
            _arragroCmsManagementClient = arragroCmsManagementClient;
        }
        protected HttpRequest Request => ViewContext.HttpContext.Request;
        protected HttpResponse Response => ViewContext.HttpContext.Response;
        
        public ViewContext ViewContext { get; set; }

        private string GetDropdownItems(string id, IEnumerable<SiteMapDto> sitemaps)
        {
            var output = new StringBuilder($"<div class=\"dropdown-menu\" aria-labelledby=\"{id}\">");

            foreach (var sitemap in sitemaps)
            {
                output.Append($"<a class=\"dropdown-item\" href=\"/{sitemap.Url}\">{sitemap.Name}</a>");
            }

            output.Append("</div>");

            return output.ToString();
        }

        private string GetNavItems(SiteMapContainerDto sitemapContainer)
        {
            var output = new StringBuilder();
            foreach (var sitemap in sitemapContainer.SiteMaps)
            {
                output.Append($"<li class=\"nav-item\"><a href=\"/{sitemap.Url}\" class=\"nav-link\">{sitemap.Name}</a></li>");
            }
            return output.ToString();
        }
        
        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            var sitemapContainer = await _arragroCmsManagementClient.GetSitemapAsync(Request.Host.Host, Request.Host.Port);

            output.TagName = "ul";
            output.Attributes.Add(new TagHelperAttribute("class", "navbar-nav"));
            output.Content.SetHtmlContent($"{GetNavItems(sitemapContainer)}");
            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
