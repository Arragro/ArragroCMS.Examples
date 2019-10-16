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

        private string GetDropdownItems(string id, IEnumerable<ContentIndexItemSmallDto> contentItems, bool draft)
        {
            var output = new StringBuilder($"<div class=\"dropdown-menu\" aria-labelledby=\"{id}\">");

            foreach (var contentItem in contentItems)
            {
                output.Append($"<a class=\"dropdown-item\" href=\"/{contentItem.Url}{(draft ? "/draft" : "")}\">{contentItem.Name}</a>");
            }

            output.Append("</div>");

            return output.ToString();
        }

        private string GetNavItems(ContentsIndexContainerDto sitemapContainer, bool draft)
        {
            var output = new StringBuilder();
            foreach (var sitemap in sitemapContainer.Contents)
            {
                var className = "nav-link";
                var sitemapPath = $"/{sitemap.Controller}/{sitemap.Action}/{sitemap.SiteId}/{sitemap.UrlRouteId}/{sitemap.Status}".ToLower();
                if (Request.Path.ToString().ToLower() == sitemapPath)
                    className += " active";
                output.Append($"<li class=\"nav-item\"><a href=\"/{sitemap.Url}{(draft ? "/draft" : "")}\" class=\"{className}\">{sitemap.Name}</a></li>");
            }
            return output.ToString();
        }
        
        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            bool draft = Request.Path.HasValue && Request.Path.Value.ToLower().EndsWith("/draft");
            var contentIndexContainer = await _arragroCmsManagementClient.GetContentIndexContainerAsync(Request.Host.Host, Request.Host.Port, draft);
                        
            output.TagName = "ul";
            output.Attributes.Add(new TagHelperAttribute("class", "navbar-nav"));
            output.Content.SetHtmlContent($"{GetNavItems(contentIndexContainer, draft)}");
            output.TagMode = TagMode.StartTagAndEndTag;
        }
    }
}
