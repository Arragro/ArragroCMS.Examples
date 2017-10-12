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

        // GET: /<controller>/
        public async Task<IActionResult> Home(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<MarkdownPage>("home", CultureInfo.CurrentCulture, Status.Published);

            return View("Index", content);
        }

        // GET: /<controller>/
        public async Task<IActionResult> Index(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<MarkdownPage>(siteId, CultureInfo.CurrentCulture, id, status);
            return View(content);
        }
    }
}
