using arragro.com.ContentTypes.Pages;
using ArragroCMS.Core.Web.Enums;
using ArragroCMS.Web.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using System.Threading.Tasks;

namespace www.arragro.com.Controllers
{
    public class MarkdownPageController : Controller
    {
        private readonly IArragroCmsManagementClient _arragroCmsManagementClient;

        public MarkdownPageController(IArragroCmsManagementClient arragroCmsManagementClient)
        {
            _arragroCmsManagementClient = arragroCmsManagementClient;
        }

        public async Task<IActionResult> Home(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<MarkdownPage>(Request.Host.Host, Request.Host.Port, "home", CultureInfo.CurrentCulture, Status.Published);

            return View("HomePageOveride", content);
        }
        
        public async Task<IActionResult> Index(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<MarkdownPage>(siteId, id, status);
            ViewBag.Content = content.ContentDto;
            return View(content.ParsedContent[CultureInfo.CurrentCulture.Name]);
        }
    }
}
