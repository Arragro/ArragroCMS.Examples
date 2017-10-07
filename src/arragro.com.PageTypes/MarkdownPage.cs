using Arragro.Common.RulesExceptions;
using ArragroCMS.Core.Web.Interfaces;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace arragro.com.PageTypes
{
    [DisplayName("Markdown Page")]
    public class MarkdownPage : RulesBase<MarkdownPage>, ICliPageType
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

        public void Validate()
        {
            ValidateModelPropertiesAndBuildRulesException(this);
            RulesException.ThrowException();
        }
    }
}
