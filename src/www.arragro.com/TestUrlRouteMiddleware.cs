using Arragro.Core.Web.Http;
using ArragroCMS.Core.Web.DataTransformationObjects;
using ArragroCMS.Core.Web.Enums;
using ArragroCMS.Web.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace www.arragro.com
{
    public class TestUrlRouteMiddleware
    {
        private readonly IArragroCmsManagementClient _arragroCmsManagementClient;
        private readonly RequestDelegate _next;

        public TestUrlRouteMiddleware(
            IArragroCmsManagementClient arragroCmsManagementClient,
            RequestDelegate next)
        {
            _next = next;
            _arragroCmsManagementClient = arragroCmsManagementClient;
        }

        private HttpCache GetHttpCache(HttpContext context)
        {
            var httpCache = new HttpCache();
            if (context.Request.Headers.ContainsKey("If-None-Match"))
            {
                httpCache.ETag = context.Request.Headers["If-None-Match"];
            }
            if (context.Request.Headers.ContainsKey("If-Modified-Since"))
            {
                string lastModified = context.Request.Headers["If-Modified-Since"];
                if (!string.IsNullOrWhiteSpace(lastModified))
                {
                    DateTime date;
                    if (DateTime.TryParse(lastModified, out date))
                    {
                        httpCache.LastModified = date;
                    }
                }
            }
            return httpCache;
        }

        private string SetCacheHeaders(HttpContext context, ContentWebClientDto entry)
        {
            var headers = context.Response.GetTypedHeaders();

            headers.CacheControl = new CacheControlHeaderValue()
            {
                Public = true,
                MaxAge = TimeSpan.FromMinutes(5),
            };

            var etag = ETagHelper.GenerateETag(entry.Id.ToString(), entry.ModifiedDate);
            headers.Headers["ETag"] = etag;
            headers.LastModified = entry.ModifiedDate;

            return etag;
        }

        private bool ProcessPage(HttpContext context, ContentWebClientDto entry, Status status)
        {
            var etag = SetCacheHeaders(context, entry);

            var contextHttpCache = GetHttpCache(context);
            if (contextHttpCache.IsCached(etag, entry.ModifiedDate))
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotModified;
                return false;
            }
            else
            {
                context.Request.Path = $"/{entry.Controller}/{entry.Action}/{entry.SiteId}/{entry.Id}/{status}";

                if (context.Request.QueryString.HasValue)
                    context.Request.QueryString = new QueryString($"{context.Request.QueryString.Value}&siteId={entry.SiteId}&id={entry.Id}&status={status}&cmsContentHandled=true");
                else context.Request.QueryString = new QueryString($"?siteId={entry.SiteId}&id={entry.Id}&status={status}&cmsContentHandled=true");
                return true;
            }
        }

        private bool IsHandled(HttpContext context)
        {
            var cmsContentHandled = context.Request.Query["cmsContentHandled"];
            if (cmsContentHandled.Any())
                return cmsContentHandled.Single() == "true";
            return false;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (!IsHandled(context))
            {
                var path = context.Request.Path.HasValue ? context.Request.Path.Value : "";

                if (!string.IsNullOrWhiteSpace(path) && path.Length > 0)
                {
                    var url = path.Remove(0, 1);
                    var status = Status.Published;

                    var pathSplit = path.Split('/');
                    if (pathSplit.Length > 2)
                    {
                        if (Enum.TryParse(pathSplit[pathSplit.Length - 1], true, out Status parsedStatus))
                        {
                            if (Enum.IsDefined(typeof(Status), parsedStatus))
                            {
                                status = parsedStatus;
                                url = url.Replace($"/{pathSplit[pathSplit.Length - 1]}", "");
                            }
                        }
                    }

                    if (!string.IsNullOrEmpty(url))
                    {
                        var entry = await _arragroCmsManagementClient.GetContentEntryAsync(context.Request.Host.Host, context.Request.Host.Port, url, status);
                        if (entry != null)
                        {
                            if (!ProcessPage(context, entry, status))
                                return;
                        }
                    }
                }
            }
            await _next(context);
        }
    }
}
