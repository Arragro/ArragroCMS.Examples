using Arragro.Core.DistributedCache;
using ArragroCMS.Web.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace www.arragro.com.Controllers
{
    public class UtilsController : Controller
    {
        private readonly IArragroCmsManagementClient _arragroCmsManagementClient;
        private readonly DistributedCacheManager _distributedCacheManager;

        public UtilsController(
            IArragroCmsManagementClient arragroCmsManagementClient,
            DistributedCacheManager distributedCacheManager)
        {
            _arragroCmsManagementClient = arragroCmsManagementClient;
            _distributedCacheManager = distributedCacheManager;
        }

        private string BasePath()
        {
            return $"{(HttpContext.Request.IsHttps ? "https://" : "http://") }{ HttpContext.Request.Host.Host}:{ HttpContext.Request.Host.Port}/";
        }

        [Route("robots.txt")]
        public async Task<IActionResult> Robots()
        {
            var robots = await _distributedCacheManager.GetAsync("UtilsController:Robots", () =>
            {
                var basePath = BasePath();
                return $@"
# robots.txt for arragro.com
Sitemap: {basePath}sitemap.xml
User-agent: *>";
            });

            return Content(robots);
        }

        [Route("sitemap.xml")]
        public async Task<IActionResult> Sitemap()
        {
            var sitemap = await _distributedCacheManager.GetAsync("UtilsController:Sitemap", async () =>
            {
                var contentIndexes = await _arragroCmsManagementClient.GetContentIndexContainerAsync(HttpContext.Request.Host.Host, HttpContext.Request.Host.Port);
                var urls = new StringBuilder();
                var basePath = BasePath();
                foreach (var contentIndex in contentIndexes.Contents.OrderBy(x => x.Url))
                {
                    urls.Append($"<url><loc>{basePath}{contentIndex.Url}</loc><lastmod>{contentIndex.ModifiedDate.ToString("yyyy-MM-dd")}</lastmod></url>");
                }

                return $@"
<?xml version=""1.0"" encoding=""UTF-8""?>
<urlset xmlns=""http://www.sitemaps.org/schemas/sitemap/0.9"">
{urls.ToString()}
</urlset>";
            });


            return Content(sitemap);
        }
    }
}