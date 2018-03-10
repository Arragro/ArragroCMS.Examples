using arragro.com.ContentTypes.Post;
using ArragroCMS.Core.Web.Enums;
using ArragroCMS.Web.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using System.Threading.Tasks;
using www.arragro.com.Models;

namespace www.arragro.com.Controllers
{
    public class MarkdownPostController : Controller
    {
        private readonly IArragroCmsManagementClient _arragroCmsManagementClient;

        public MarkdownPostController(IArragroCmsManagementClient arragroCmsManagementClient)
        {
            _arragroCmsManagementClient = arragroCmsManagementClient;
        }

        // GET: /<controller>/
        public async Task<IActionResult> Index(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<MarkdownPost>(siteId, id, status);
            ViewBag.MetaData = new MetaData(content.ContentDto);
            return View(content.ParsedContent[CultureInfo.CurrentCulture.Name]);
        }
    }
}
