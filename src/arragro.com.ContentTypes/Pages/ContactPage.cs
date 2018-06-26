using arragro.com.ContentTypes.Models;
using Arragro.Core.Common.RulesExceptions;
using ArragroCMS.Core.Web.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Pages
{
    [DisplayName("Contact Page")]
    public class ContactPage : RulesBase<ContactPage>, ICliPageType
    {
        [Required]
        [MaxLength(100)]
        public string AddressLine1 { get; set; }
        [MaxLength(100)]
        public string AddressLine2 { get; set; }
        [Required]
        [MaxLength(100)]
        public string City { get; set; }
        [MaxLength(100)]
        public string District { get; set; }
        [MaxLength(100)]
        public string Country { get; set; }
        [MaxLength(10)]
        public string PostCode { get; set; }
        [MaxLength(20)]
        [Phone]
        public string OfficeTelephone { get; set; }
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string OfficeEmail { get; set; }

        public List<Contact> Contacts { get; set; }

        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }

        public string GoogleMapStyleJson { get; set; }

        [MaxLength(2000)]
        public string MarkdownIntro { get; set; }
        [MaxLength(2000)]
        public string MarkdownOutro { get; set; }

        public bool HasContactForm { get; set; }

        public ContactPage()
        {
            Contacts = new List<Contact>();
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
