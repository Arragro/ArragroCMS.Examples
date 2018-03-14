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
    public class ContactPageController : Controller
    {
        private readonly IArragroCmsManagementClient _arragroCmsManagementClient;

        public ContactPageController(IArragroCmsManagementClient arragroCmsManagementClient)
        {
            _arragroCmsManagementClient = arragroCmsManagementClient;
        }
                
        public async Task<IActionResult> Index(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<ContactPage>(siteId, id, status);
            ViewBag.MetaData = new MetaData(content.ContentDto);
            ViewBag.Layout = content.ContentDto.Layout;
            return View(content.ParsedContent[CultureInfo.CurrentCulture.Name]);
        }
    }
}