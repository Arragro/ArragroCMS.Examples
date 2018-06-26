using arragro.com.ContentTypes.Models;
using Arragro.Core.Common.RulesExceptions;
using ArragroCMS.Core.Web.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Pages
{
    [DisplayName("Tile Bullet Page")]
    public class TileBulletPage : RulesBase<TileBulletPage>, ICliPageType
    {
        [Required]
        [MaxLength(50)]
        public string Title { get; set; }

        [Required]
        [MaxLength(4000)]
        public string IntroMarkdown { get; set; }
        public bool CloudTileBullets { get; set; }
        public List<Tile> TileBullets { get; set; }
        public int LeftColumns { get; set; } = 4;
        public int RightColumns { get; set; } = 8;

        public TileBulletPage()
        {
            TileBullets = new List<Tile>();
            LeftColumns = 4;
            RightColumns = 8;
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
