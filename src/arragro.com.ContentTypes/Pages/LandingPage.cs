using arragro.com.ContentTypes.Models;
using Arragro.Core.Common.RulesExceptions;
using ArragroCMS.Core.Web.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Pages
{
    [DisplayName("Landing Page")]
    public class LandingPage : RulesBase<LandingPage>, ICliPageType
    {
        [Required]
        [MaxLength(512)]
        public string Title { get; set; }
        public List<Tile> StartingClouds { get; set; }
        public List<Tile> InfiniteClouds { get; set; }
        public List<CloudBannerText> CloudBannerTexts { get; set; }
        public string MarkdownIntro { get; set; }
        public List<SvgIconLink> SvgIconLinksServices { get; set; }
        public List<Tile> WhatWeveDones { get; set; }
        public List<Tile> TechnologyClouds { get; set; }
        public string TechnologyMarkdown { get; set; }
        public string MarkdownOutro { get; set; }
        public bool HasContactForm { get; set; }

        public LandingPage()
        {
            StartingClouds = new List<Tile>();
            InfiniteClouds = new List<Tile>();
            CloudBannerTexts = new List<CloudBannerText>();
            SvgIconLinksServices = new List<SvgIconLink>();
            WhatWeveDones = new List<Tile>();
            TechnologyClouds = new List<Tile>();
        }


        public decimal Version
        {
            get
            {
                return 1;
            }

            set
            {
                return;
            }
        }

        public Type ConfigurationType => null;
        public void Upgrade()
        {
            throw new NotImplementedException();
        }

        public void Validate(Guid urlRouteId, IServiceProvider serviceProvider)
        {
            ValidateModelPropertiesAndBuildRulesException(this);

            var rulesExceptionCollection = ValidateModelPropertiesAndBuildRulesExceptionCollection(this, new ValidationParameters());
            rulesExceptionCollection.RulesExceptions.Add(RulesException);

            rulesExceptionCollection.ThrowException();
        }
    }
}
