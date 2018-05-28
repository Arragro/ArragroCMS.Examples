using arragro.com.ContentTypes.Pages;
using arragro.com.ContentTypes.Post;
using ArragroCMS.BusinessLayer.Data.EFCore.Identity.Models;
using ArragroCMS.BusinessLayer.Data.Entities;
using ArragroCMS.BusinessLayer.Domains;
using ArragroCMS.Core.Web.DataTransformationObjects;
using ArragroCMS.Core.Web.Enums;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;
using System.Linq;

namespace cms.arragro.com
{
    public static class SeedDatabase
    {
        private static readonly CultureInfo _culture_en = new CultureInfo("en");
        private static readonly CultureInfo _culture_en_nz = new CultureInfo("en-nz");

        private static void CreatePage(
            Site site, User adminUser, UrlRoutes urlRoutes, ArragroCMS.BusinessLayer.Domains.UrlRouteTypes urlRouteTypeLookups, Contents contents, IMapper mapper,
            string url, string title, MarkdownPage en, MarkdownPage en_nz)
        {
            var testUrlRoute = urlRoutes.FindUrlRoute(url, Status.Published);
            if (testUrlRoute == null)
            {
                var parentUrlRoute = new UrlRoute(site.SiteId, url, urlRouteTypeLookups.Get("Page"), adminUser.Id);

                var content = new Content(parentUrlRoute, title, typeof(MarkdownPage));
                content.AddContent(_culture_en, en);
                content.AddContent(_culture_en_nz, en_nz);
                var contentDto = mapper.Map<ContentDtoJsonAsObject>(content);
                contentDto.Status = Status.Published.ToString();

                var contentResult = contents.AddOrUpdateContent(contentDto, parentUrlRoute.CreatedBy);
                content = contentResult.Single(x => x.Status == Status.Published);
            }
        }
        private static void CreatePost(
            Site site, User adminUser, UrlRoutes urlRoutes, ArragroCMS.BusinessLayer.Domains.UrlRouteTypes urlRouteTypeLookups, Contents contents, IMapper mapper,
            string url, string title, MarkdownPost en, MarkdownPost en_nz)
        {
            var testUrlRoute = urlRoutes.FindUrlRoute(url, Status.Published);
            if (testUrlRoute == null)
            {
                var parentUrlRoute = new UrlRoute(site.SiteId, url, urlRouteTypeLookups.Get("Post"), adminUser.Id);

                var content = new Content(parentUrlRoute, title, typeof(MarkdownPost));
                content.AddContent(_culture_en, en);
                content.AddContent(_culture_en_nz, en_nz);
                var contentDto = mapper.Map<ContentDtoJsonAsObject>(content);
                contentDto.Status = Status.Published.ToString();

                var contentResult = contents.AddOrUpdateContent(contentDto, parentUrlRoute.CreatedBy);
                content = contentResult.Single(x => x.Status == Status.Published);
            }
        }

        private static void CreatePosts(Site site, User adminUser, UrlRoutes urlRoutes, ArragroCMS.BusinessLayer.Domains.UrlRouteTypes urlRouteTypeLookups, Contents contents, IMapper mapper)
        {
            for (var i = 0; i < 50; i++)
            {
                var postNumber = i + 1;
                var post_en = new MarkdownPost { Title = $"Post {postNumber} EN", Markdown = "This is the EN post." };
                var post_en_nz = new MarkdownPost { Title = $"Post {postNumber} EN-NZ", Markdown = "This is the EN-NZ post." };
                CreatePost(site, adminUser, urlRoutes, urlRouteTypeLookups, contents, mapper, $"post-{postNumber}", $"Post {postNumber}", post_en, post_en_nz);
            }
        }

        public static void SeedCmsDatabase(this IServiceCollection serviceCollection)
        {
            var serviceProvider = serviceCollection.BuildServiceProvider();

            var sites = serviceProvider.GetService<Sites>();
            var allSites = sites.All();

            if (allSites.Count() == 1)
            {
                var site = allSites.First();
                var urlRoutes = serviceProvider.GetService<UrlRoutes>();
                var contents = serviceProvider.GetService<Contents>();
                var users = serviceProvider.GetService<Users>();
                var urlRouteTypeLookups = serviceProvider.GetService<ArragroCMS.BusinessLayer.Domains.UrlRouteTypes>();
                var mapper = serviceProvider.GetService<IMapper>();


                var adminUser = users.Get("support@arragro.com").Result;

                var test_en = new MarkdownPage { Title = "Test Page EN", Markdown = "This is the EN test page." };
                var test_en_nz = new MarkdownPage { Title = "Test Page EN-NZ", Markdown = "This is the EN-NZ test page." };
                CreatePage(site, adminUser, urlRoutes, urlRouteTypeLookups, contents, mapper, "test", "Test Page", test_en, test_en_nz);

                var home_en = new MarkdownPage { Title = "Home Page EN", Markdown = "This is the EN home page." };
                var home_en_nz = new MarkdownPage { Title = "Home Page EN-NZ", Markdown = "This is the EN-NZ home page." };
                CreatePage(site, adminUser, urlRoutes, urlRouteTypeLookups, contents, mapper, "home", "Home Page", home_en, home_en_nz);

                CreatePosts(site, adminUser, urlRoutes, urlRouteTypeLookups, contents, mapper);
            }
        }
    }
}
