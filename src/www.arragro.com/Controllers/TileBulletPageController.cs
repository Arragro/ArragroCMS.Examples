using arragro.com.ContentTypes.Pages;
using ArragroCMS.Core.Web.Enums;
using ArragroCMS.Web.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using System.Threading.Tasks;
using www.arragro.com.Models;

namespace www.arragro.com.Controllers
{
    public class TileBulletPageController : Controller
    {
        private readonly IArragroCmsManagementClient _arragroCmsManagementClient;

        public TileBulletPageController(IArragroCmsManagementClient arragroCmsManagementClient)
        {
            _arragroCmsManagementClient = arragroCmsManagementClient;
        }
                
        public async Task<IActionResult> Index(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<TileBulletPage>(siteId, id, status);
            ViewBag.MetaData = new MetaData(content.ContentDto);
            return View(content.ParsedContent[CultureInfo.CurrentCulture.Name]);
        }
    }
}