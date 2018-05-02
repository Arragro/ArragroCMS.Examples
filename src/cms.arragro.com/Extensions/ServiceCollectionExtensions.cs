using Arragro.Core.Common.Interfaces.Providers;
using ArragroCMS.BusinessLayer;
using ArragroCMS.BusinessLayer.Data.EFCore;
using ArragroCMS.BusinessLayer.Data.EFCore.Identity;
using ArragroCMS.BusinessLayer.Data.EFCore.Identity.Models;
using ArragroCMS.BusinessLayer.Data.Lookups;
using ArragroCMS.Core.Interfaces.Domains;
using ArragroCMS.Core.Interfaces.Providers;
using ArragroCMS.Core.Models;
using ArragroCMS.Web.Management.Extensions;
using ArragroCMS.Web.Management.Filters;
using ArragroCMS.Web.Management.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace cms.arragro.com.Extentions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection ConfigureDatabaseService(this IServiceCollection services, ConfigurationSettings configurationSettings)
        {
            if (configurationSettings.ApplicationSettings.UseInMemoryDatabase)
            {
                services.AddDbContext<ArragroCmsContext>(options => options.UseInMemoryDatabase("InMemory"));
                services.AddDbContext<ArragroCmsIdentityContext>(options => options.UseInMemoryDatabase("InMemory"));
            }
            else
            {
                services.AddDbContext<ArragroCmsContext>(
                    options => options.UseSqlServer(configurationSettings.ConnectionStrings.CmsDatabaseConnection, sqlOptions => sqlOptions.EnableRetryOnFailure(3))
                );

                services.AddDbContext<ArragroCmsIdentityContext>(
                    options => options.UseSqlServer(configurationSettings.ConnectionStrings.CmsDatabaseConnection, sqlOptions => sqlOptions.EnableRetryOnFailure(3))
                );
            }

            return services;
        }

        public static IServiceCollection CreateAndMigrateDatabase(
            this IServiceCollection services,
            ConfigurationSettings configurationSettings,
            CultureInfo defaultCulture,
            IEnumerable<CultureInfo> cultures)
        {
            var serviceProvider = services.BuildServiceProvider();

            var arragroCmsContext = serviceProvider.GetService<ArragroCmsContext>();
            if (!configurationSettings.ApplicationSettings.UseInMemoryDatabase)
            {
                var arragroCmsIdentityContext = serviceProvider.GetService<ArragroCmsIdentityContext>();
    #if DEBUG
                if ((arragroCmsContext.GetService<IDatabaseCreator>() as RelationalDatabaseCreator).Exists())
                {
                    if (configurationSettings.ApplicationSettings.DeleteDatabaseOnStartup)
                        arragroCmsContext.Database.EnsureDeleted();
                }
    #endif
                arragroCmsContext.Database.Migrate();
                arragroCmsIdentityContext.Database.Migrate();
            }
            serviceProvider.GetService<UrlRouteTypeLookups>();
            arragroCmsContext.EnsureSeedData(serviceProvider, configurationSettings, defaultCulture, cultures);

            return services;
        }

        public static IServiceCollection CreateAndMigrateDatabase(
            this IServiceCollection services,
            ConfigurationSettings configurationSettings,
            CultureInfo defaultCulture)
        {
            return CreateAndMigrateDatabase(services, configurationSettings, defaultCulture, Enumerable.Empty<CultureInfo>());
        }


        public static IServiceCollection AddDefaultArragroCmsAuthorization(this IServiceCollection services)
        {
            var settings = services.GetSettings();
            var externalAuthenticationProviders = settings.GetExternalAuthenticationSettings();

            return services.AddAuthorization(options =>
            {
                options.AddPolicy("ReadOnly", policy =>
                {
                    policy.RequireClaim(ClaimTypes.Role, Lookups.Roles.Administrator, Lookups.Roles.ContentAuthor, Lookups.Roles.ReadOnly);
                    policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                });
                options.AddPolicy("AdministratorOnly", policy =>
                {
                    policy.RequireClaim(ClaimTypes.Role, Lookups.Roles.Administrator);
                    policy.AuthenticationSchemes.Add(IdentityConstants.ApplicationScheme);
                    if (externalAuthenticationProviders.AzureAdAccountAuthenticationSettings.Enabled)
                        policy.AuthenticationSchemes.Add(CookieAuthenticationDefaults.AuthenticationScheme);
                });
                options.AddPolicy("ContentAuthors", policy =>
                {
                    policy.RequireClaim(ClaimTypes.Role, Lookups.Roles.Administrator, Lookups.Roles.ContentAuthor);
                    policy.AuthenticationSchemes.Add(IdentityConstants.ApplicationScheme);
                    if (externalAuthenticationProviders.AzureAdAccountAuthenticationSettings.Enabled)
                        policy.AuthenticationSchemes.Add(CookieAuthenticationDefaults.AuthenticationScheme);
                });
            });
        }

        private static Task CookieEventHandler(RedirectContext<CookieAuthenticationOptions> ctx, HttpStatusCode httpStatusCode)
        {
            if (ctx.Response.StatusCode == (int)HttpStatusCode.OK)
            {
                ctx.Response.StatusCode = (int)httpStatusCode;
            }
            return Task.FromResult(0);
        }

        private static void SetCookieAuthenticationOptions(this CookieAuthenticationOptions cookieAuthenticationOptions, TimeSpan cookieExpiration, IDataProtectionProvider dataProtection)
        {
            cookieAuthenticationOptions.DataProtectionProvider = dataProtection;
            cookieAuthenticationOptions.TicketDataFormat =
                new TicketDataFormat(
                    dataProtection.CreateProtector(
                        "Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationMiddleware",
                        "Cookies",
                        "v2"));
            cookieAuthenticationOptions.SlidingExpiration = true;
            cookieAuthenticationOptions.ExpireTimeSpan = cookieExpiration;
            cookieAuthenticationOptions.Cookie.Name = "cms-arragro";
            cookieAuthenticationOptions.Cookie.Expiration = cookieExpiration;
            cookieAuthenticationOptions.Cookie.SameSite = SameSiteMode.Strict;
            cookieAuthenticationOptions.Events.OnRedirectToLogin = c =>
            {
                if (c.Request.Path.Value.StartsWith("/api"))
                {
                    c.Response.Clear();
                    c.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.FromResult(0);
                }
                c.Response.Redirect(c.RedirectUri);
                return Task.FromResult(0);
            };
        }

        public static IServiceCollection AddCustomArragroCmsServices(
            this IServiceCollection services,
            ConfigurationSettings configurationSettings,
            CultureInfo defaultCulture,
            CultureInfo[] supportedCultures,
            TimeSpan cookieExpiration,
            params string[] assemblyPrefixForCustomContentTypes)
        {
            services = services.AddArragroCMSServices(assemblyPrefixForCustomContentTypes)
                    .AddScoped<SiteIdFilterAttribute>()
                    .AddSingleton(configurationSettings)
                    .AddSingleton(configurationSettings.SmtpSettings)
                    .ConfigureDatabaseService(configurationSettings)
                    .AddAutoMapper(cfg =>
                    {
                        cfg.CreateMissingTypeMaps = true;
                        cfg.AddProfile<ArragroCMSAutoMapperProfile>();
                    })
                    .AddAntiforgery(options =>
                    {
                        options.HeaderName = "X-CSRF-TOKEN-ARRAGROCMS";
                        options.Cookie.SameSite = SameSiteMode.Strict;
                        options.Cookie.Name = "cms-arragro-antiforgery";
                    })
                    .AddSingleton<IStorageProvider, ArragroCMS.Providers.AzureStorageProvider>()
                    .AddSingleton<IImageProvider, Arragro.Providers.ImageMagickProvider.ImageProvider>()
                    .AddSingleton<IEmailProvider, Arragro.Providers.SendgridEmailProvider.EmailProvider>()
                    .AddScoped<SignInManager<User>, UserSignIn<User>>();


            /*
             * https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/?view=aspnetcore-2.1
             * https://github.com/aspnet/DataProtection
             * https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/compatibility/replacing-machinekey?view=aspnetcore-2.1
             * http://www.paraesthesia.com/archive/2016/06/15/set-up-asp-net-dataprotection-in-a-farm/
             * Create crt and key in ubuntu bash:
             * openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:4096 -keyout privateKey.key -out certificate.crt
             * 
             * Create PFX from crt and key
             * openssl pkcs12 -export -out certificate.pfx -inkey privateKey.key -in certificate.crt
             * 
             * Add the cert to the certmgr local machine - you can get it at: C:\Users\{UserName}\AppData\Local\lxss\root
             * 
             */
            var store = new X509Store(StoreLocation.LocalMachine);
            store.Open(OpenFlags.ReadOnly);
            X509Certificate2Collection x509Certificate2Collection = store.Certificates.Find(X509FindType.FindByThumbprint, "d0961c247d0b2e240a5c510eb616569b4d6c244b", false);
            X509Certificate2 x509Cert = x509Certificate2Collection.Count > 0 ? x509Certificate2Collection[0] : null;
            store.Close();

            services.AddDataProtection()
                .PersistKeysToFileSystem(new DirectoryInfo(@"d:\temp-keys"))
                .ProtectKeysWithCertificate(x509Cert);

            services.AddIdentity<User, Role>(config =>
            {
                config.SignIn.RequireConfirmedEmail = true;
            })
                    .AddEntityFrameworkStores<ArragroCmsIdentityContext>()
                    .AddDefaultTokenProviders();

            services.CreateAndMigrateDatabase(configurationSettings, defaultCulture, supportedCultures);

            services.AddDefaultArragroCmsAuthorization();

            services.ConfigureApplicationCookie(config =>
            {
                config.Events.OnRedirectToAccessDenied = (ctx) => CookieEventHandler(ctx, HttpStatusCode.Unauthorized);
                config.Events.OnRedirectToLogin = (ctx) => CookieEventHandler(ctx, HttpStatusCode.Forbidden);
            });

            var settings = services.GetSettings();
            var jwtSettings = settings.GetJwtSettings();

            var dataProtection = services.BuildServiceProvider().GetDataProtectionProvider();


            var authBuilder = services.AddAuthentication(opt =>
            {
                opt.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                opt.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                opt.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidIssuer = jwtSettings.Issuer,
                        ValidAudience = jwtSettings.Audience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
                        ValidateLifetime = true
                    };
                })
                .AddExternalAuthentication()
                .AddCookie(cfg =>
                {
                    cfg.SetCookieAuthenticationOptions(cookieExpiration, dataProtection);
                    cfg.Cookie.SameSite = SameSiteMode.Strict;
                });

            services.ConfigureApplicationCookie(cfg =>
            {
                cfg.Cookie.SameSite = SameSiteMode.Strict;
                cfg.SetCookieAuthenticationOptions(cookieExpiration, dataProtection);
            });

            return services;
        }

        public static string[] GetDefaultAuthenticationSchemas(this IServiceCollection services)
        {
            var settings = services.GetSettings();
            var externalAuthenticationProviders = settings.GetExternalAuthenticationSettings();

            var defaultSchemas = new List<string>() { JwtBearerDefaults.AuthenticationScheme, IdentityConstants.ApplicationScheme };
            if (externalAuthenticationProviders.AzureAdAccountAuthenticationSettings.Enabled)
                defaultSchemas.Add(CookieAuthenticationDefaults.AuthenticationScheme);

            return defaultSchemas.ToArray();
        }
    }
}