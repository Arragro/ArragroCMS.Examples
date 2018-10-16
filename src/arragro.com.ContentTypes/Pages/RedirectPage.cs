using Arragro.Core.Common.RulesExceptions;
using ArragroCMS.Core.Web.Interfaces;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Pages
{
    [DisplayName("Redirect Page")]
    public class RedirectPage : RulesBase<RedirectPage>, ICliContentType
    {
        [Url]
        [Required]
        [MaxLength(2000)]
        public string RedirectUrl { get; set; }


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
            rulesExceptionCollection.ThrowException();
        }
    }
}
