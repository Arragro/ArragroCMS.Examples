using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Models
{
    public class ContactForm
    {
        [Required]
        [JsonIgnore]
        public string RecapchtaResponse { get; set; }
        [Required]
        [MaxLength(100)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }
        [Required]
        [MaxLength(100)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }
        [MaxLength(100)]
        public string Company { get; set; }
        [Required]
        [RegularExpression(@"^\+?\d{7,13}$", ErrorMessage = "Please supply a valid phone number")]
        public string Phone { get; set; }
        [Required]
        [MaxLength(2000)]
        [EmailAddress]
        public string Email { get; set; }
        public string Message { get; set; }
    }
}
