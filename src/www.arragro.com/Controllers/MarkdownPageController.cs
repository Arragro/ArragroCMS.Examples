﻿using arragro.com.ContentTypes.Pages;
using ArragroCMS.Core.Web.Enums;
using ArragroCMS.Web.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using System.Threading.Tasks;
using www.arragro.com.Models;

namespace www.arragro.com.Controllers
{
    public class MarkdownPageController : Controller
    {
        private readonly IArragroCmsManagementClient _arragroCmsManagementClient;

        public MarkdownPageController(IArragroCmsManagementClient arragroCmsManagementClient)
        {
            _arragroCmsManagementClient = arragroCmsManagementClient;
        }

        public IActionResult Home(Guid siteId, Guid id, Status status)
        {
            return View("HomePageOveride");
        }
        
        public async Task<IActionResult> Index(Guid siteId, Guid id, Status status)
        {
            var content = await _arragroCmsManagementClient.GetContentAsync<MarkdownPage>(siteId, id, status);
            ViewBag.MetaData = new MetaData(content.ContentDto);
            return View(content.ParsedContent[CultureInfo.CurrentCulture.Name]);
        }
    }
}
