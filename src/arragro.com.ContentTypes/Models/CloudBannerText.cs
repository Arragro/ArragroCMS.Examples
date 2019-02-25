using System.ComponentModel.DataAnnotations;
using Arragro.Core.Common.RulesExceptions;

namespace arragro.com.ContentTypes.Models
{
    public class CloudBannerText : RulesBase<CloudBannerText>, IRulesBase<ValidationParameters>
    {
        [Required]
        [MaxLength(200)]
        public string Markdown { get; set; }

        public void Validate(ValidationParameters parameters)
        {
            ValidateModelPropertiesAndBuildRulesException(this);

            if (parameters.ThrowException)
                RulesException.ThrowException();
        }
    }
}
