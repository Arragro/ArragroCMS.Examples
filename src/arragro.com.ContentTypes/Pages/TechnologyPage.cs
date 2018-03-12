using arragro.com.ContentTypes.Models;
using Arragro.Core.Common.RulesExceptions;
using ArragroCMS.Core.Web.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Pages
{
    [DisplayName("Technology Page")]
    public class TechnologyPage : RulesBase<TechnologyPage>, ICliPageType
    {
        [Required]
        [MaxLength(50)]
        public string Title { get; set; }

        [Required]
        [MaxLength(512)]
        public string IntroMarkdown { get; set; }

        public List<Tile> TechnologySections { get; set; }

        public TechnologyPage()
        {
            TechnologySections = new List<Tile>();
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
