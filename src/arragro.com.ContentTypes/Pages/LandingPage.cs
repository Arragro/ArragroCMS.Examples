using arragro.com.ContentTypes.Models;
using Arragro.Common.RulesExceptions;
using ArragroCMS.Core.Web.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace arragro.com.ContentTypes.Pages
{
    [DisplayName("Landing Page")]
    public class LandingPage : RulesBase<LandingPage>, ICliPageType
    {
        [Required]
        [MaxLength(512)]
        public string Title { get; set; }
        public List<Carousel> Carousels { get; set; }
        public List<SvgIconLink> SvgIconLinks { get; set; }
        
        public Carousel GetRandomCarousel()
        {
            var random = new Random();
            int index = random.Next(Carousels.Count());
            return Carousels.ElementAt(index);
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
