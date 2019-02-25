using System.ComponentModel.DataAnnotations;
using Arragro.Core.Common.RulesExceptions;

namespace arragro.com.ContentTypes.Models
{
    public class Carousel : RulesBase<Carousel>, IRulesBase<ValidationParameters>
    {
        [Required]
        [MaxLength(128)]
        public string Name { get; set; }
        [Required]
        [MaxLength(2000)]
        public string ImageUrl { get; set; }
        [MaxLength(512)]
        public string ImageAlt { get; set; }

        public bool HasLink { get; set; }
        [MaxLength(1000)]
        public string LinkText { get; set; }
        [MaxLength(2000)]
        public string Href { get; set; }

        public void Validate(ValidationParameters parameters)
        {
            ValidateModelPropertiesAndBuildRulesException(this);

            if (parameters.ThrowException)
                RulesException.ThrowException();
        }
    }
}
