using arragro.com.ContentTypes.Pages;
using ArragroCMS.Core.Web.Enums;
using ArragroCMS.Web.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using System.Threading.Tasks;

namespace www.arragro.com.Controllers
{
    public class RedirectPageController : Controller
    {
        private readonly IArragroCmsManagementClient _arragroCmsManagementClient;

        public RedirectPageController(IArragroCmsManagementClient arragroCmsManagementClient)
        {
            _arragroCmsManagementClient = arragroCmsManagementClient;
        }
                
        public async Task<IActionResult> Index(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<RedirectPage>(siteId, id, status);
            return Redirect(content.ParsedContent[CultureInfo.CurrentCulture.Name].RedirectUrl);
        }
    }
}