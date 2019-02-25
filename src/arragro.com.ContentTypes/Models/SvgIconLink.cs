using System.ComponentModel.DataAnnotations;
using Arragro.Core.Common.RulesExceptions;

namespace arragro.com.ContentTypes.Models
{
    public class SvgIconLink : RulesBase<SvgIconLink>, IRulesBase<ValidationParameters>
    {
        [Required]
        [MaxLength(255)]
        public string Title { get; set; }
        [Required]
        public string Svg { get; set; }
        [Required]
        [MaxLength(2000)]
        public string Href { get; set; }
        public string Markdown { get; set; }

        public void Validate(ValidationParameters parameters)
        {
            ValidateModelPropertiesAndBuildRulesException(this);

            if (parameters.ThrowException)
                RulesException.ThrowException();
        }
    }
}
