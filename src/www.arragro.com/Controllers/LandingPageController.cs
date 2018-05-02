using arragro.com.ContentTypes.Pages;
using ArragroCMS.Core.Web.Enums;
using ArragroCMS.Web.Data;
using ArragroCMS.Web.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using System.Threading.Tasks;
using www.arragro.com.Models;

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
            var content = await _arragroCmsManagementClient.GetContentAsync<LandingPage>(Request.Host.Host, Request.Host.Port, "home", Status.Published);
            ViewBag.MetaData = new MetaData(content.ContentDto);
            return View("Index", content.ParsedContent[CultureInfo.CurrentCulture.Name]);
        }
        
        public async Task<IActionResult> Index(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<LandingPage>(siteId, id, status);
            ViewBag.MetaData = new MetaData(content.ContentDto);
            return View(content.ParsedContent[CultureInfo.CurrentCulture.Name]);
        }
    }
}