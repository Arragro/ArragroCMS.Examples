using arragro.com.ContentTypes.Models;
using Arragro.Common.RulesExceptions;
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
        public List<Cloud> StartingClouds { get; set; }
        public List<Cloud> InfiniteClouds { get; set; }
        public List<CloudBannerText> CloudBannerTexts { get; set; }
        public string MarkdownIntro { get; set; }
        public List<SvgIconLink> SvgIconLinksServices { get; set; }
        public string MarkdownOutro { get; set; }

        public LandingPage()
        {
            StartingClouds = new List<Cloud>();
            InfiniteClouds = new List<Cloud>();
            CloudBannerTexts = new List<CloudBannerText>();
            SvgIconLinksServices = new List<SvgIconLink>();
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

        public void Validate()
        {
            ValidateModelPropertiesAndBuildRulesException(this);
            RulesException.ThrowException();
        }
    }
}
