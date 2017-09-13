using Arragro.Common.Interfaces.Providers;
using Arragro.Common.Models;
using ArragroCMS.BusinessLayer;
using ArragroCMS.BusinessLayer.Data.EFCore.Identity;
using ArragroCMS.BusinessLayer.Data.EFCore.Identity.Models;
using ArragroCMS.Core.Enums;
using ArragroCMS.Core.Interfaces.Domains;
using ArragroCMS.Core.Models;
using ArragroCMS.Web.Management.Extensions;
using ArragroCMS.Web.Management.Filters;
using ArragroCMS.Web.Management.Helpers;
using ArragroCMS.Web.Management.Middleware;
using AutoMapper;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Globalization;
using System.IO.Compression;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace cms.arragro.com
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            Log.Logger = new LoggerConfiguration()
              .Enrich.FromLogContext()
              .WriteTo.LiterateConsole()
              .WriteTo.RollingFile("App_Data\\Logs\\log-{Date}.txt", fileSizeLimitBytes: 536870912, retainedFileCountLimit: 7)
              .CreateLogger();

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            Configuration = builder.Build();

            ConfigurationSettings = Configuration.Get<ConfigurationSettings>();
        }

        public IConfigurationRoot Configuration { get; }
        public ConfigurationSettings ConfigurationSettings { get; }

        private Task CookieEventHandler(RedirectContext<CookieAuthenticationOptions> ctx, HttpStatusCode httpStatusCode)
        {
            if (ctx.Response.StatusCode == (int)HttpStatusCode.OK)
            {
                ctx.Response.StatusCode = (int)httpStatusCode;
            }
            return Task.FromResult(0);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddArragroCMSServices(typeof(Startup).Namespace)
                    .AddSingleton<ConfigurationSettings>(ConfigurationSettings)
                    .AddSingleton<SmtpSettings>(ConfigurationSettings.SmtpSettings)
                    .ConfigureDatabaseService(ConfigurationSettings)
                    .AddAutoMapper(cfg => cfg.AddProfile<ArragroCMSAutoMapperProfile>())
                    .AddAntiforgery(options =>
                    {
                        options.HeaderName = "X-CSRF-TOKEN-ARRAGROCMS";
                    })
                    .AddSingleton<ArragroCMS.Core.Interfaces.Providers.IStorageProvider, ArragroCMS.Providers.AzureStorageProvider>()
                    .AddSingleton<IImageProvider, Arragro.Providers.ImageMagickProvider.ImageProvider>()
                    .AddSingleton<IEmailProvider, Arragro.Providers.MailKitEmailProvider.EmailProvider>()
                    .AddAuthorization(options =>
                    {
                        options.AddPolicy("ReadOnly", policy =>
                        {
                            policy.RequireClaim(ClaimTypes.Role, Lookups.Roles.Administrator, Lookups.Roles.ContentAuthor, Lookups.Roles.ReadOnly);
                            policy.AuthenticationSchemes.Add(IdentityConstants.ApplicationScheme);
                            policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                        });
                        options.AddPolicy("AdministratorOnly", policy =>
                        {
                            policy.RequireClaim(ClaimTypes.Role, Lookups.Roles.Administrator);
                            policy.AuthenticationSchemes.Add(IdentityConstants.ApplicationScheme);
                        });
                        options.AddPolicy("ContentAuthors", policy =>
                        {
                            policy.RequireClaim(ClaimTypes.Role, Lookups.Roles.Administrator, Lookups.Roles.ContentAuthor);
                            policy.AuthenticationSchemes.Add(IdentityConstants.ApplicationScheme);
                        });
                    });

            services.AddIdentity<User, Role>(config =>
            {
                config.SignIn.RequireConfirmedEmail = true;
            })
                .AddEntityFrameworkStores<ArragroCmsIdentityContext>()
                .AddDefaultTokenProviders();

            var defaultCulture = new CultureInfo("en");
            var supportedCultures = new CultureInfo[] { new CultureInfo("en-nz") };

            services.CreateAndMigrateDatabase(ConfigurationSettings, defaultCulture, supportedCultures);

            var serviceBuilder = services.BuildServiceProvider();
            var jwtSettings = serviceBuilder.GetService<ISettings>().GetJwtSettings();

            services.ConfigureApplicationCookie(config =>
            {
                config.Events.OnRedirectToAccessDenied = (ctx) => CookieEventHandler(ctx, HttpStatusCode.Unauthorized);
                config.Events.OnRedirectToLogin = (ctx) => CookieEventHandler(ctx, HttpStatusCode.Forbidden);
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
                });

            services.AddScoped<SignInManager<User>, UserSignIn<User>>();

            services.Configure<GzipCompressionProviderOptions>
                (options => options.Level = CompressionLevel.Fastest);

            services.AddResponseCompression(options =>
            {
                options.Providers.Add<GzipCompressionProvider>();
            });

            services.AddMvc(config =>
            {
                var defaultPolicy = new AuthorizationPolicyBuilder(new[] { JwtBearerDefaults.AuthenticationScheme, IdentityConstants.ApplicationScheme })
                                 .RequireAuthenticatedUser()
                                 .Build();
                config.Filters.Add(new AuthorizeFilter(defaultPolicy));
                config.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
                config.Filters.Add(new ValidateModelAttribute());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IAntiforgery antiforgery, IHostingEnvironment env, ILoggerFactory loggerFactory, IApplicationLifetime appLifetime)
        {
            loggerFactory.AddSerilog();

            appLifetime.ApplicationStopped.Register(Log.CloseAndFlush);

            if (env.IsDevelopment())
            {
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });

                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseWhen(x => !x.Request.Path.Value.StartsWith("/api"), builder =>
                {
                    builder.UseExceptionHandler("/Home/Error");
                });
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseArragroCMS();

            app.UseResponseCompression();

            app.UseMiddleware<AuthorizeCorrectlyMiddleware>();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=ArragroCms}/{action=Index}/{id?}/{status?}");

                routes.MapSpaFallbackRoute("spa-fallback", new { controller = "ArragroCms", action = "Index" });
            });
        }
    }
}
