using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ArragroCMS.Web.Interfaces;
using ArragroCMS.Core.Web.Enums;
using arragro.com.ContentTypes.Pages;
using System.Globalization;

namespace www.arragro.com.Controllers
{
    public class LandingPageController : Controller
    {
        private readonly IArragroCmsManagementClient _arragroCmsManagementClient;

        public LandingPageController(IArragroCmsManagementClient arragroCmsManagementClient)
        {
            _arragroCmsManagementClient = arragroCmsManagementClient;
        }
        
        public async Task<IActionResult> Home(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<LandingPage>("home", Status.Published);
            ViewBag.Content = content.ContentDto;
            return View(content.ParsedContent[CultureInfo.CurrentCulture.Name]);
        }
        
        public async Task<IActionResult> Index(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<LandingPage>(siteId, id, status);
            ViewBag.Content = content.ContentDto;
            return View(content.ParsedContent[CultureInfo.CurrentCulture.Name]);
        }
    }
}