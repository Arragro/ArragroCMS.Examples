using Arragro.Core.Common.RulesExceptions;
using ArragroCMS.Core.Web.Interfaces;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Pages
{
    [DisplayName("Markdown Page")]
    public class MarkdownPage : RulesBase<MarkdownPage>, ICliContentType
    {
        [Required]
        [MaxLength(512)]
        public string Title { get; set; }
        public string Markdown { get; set; }

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
