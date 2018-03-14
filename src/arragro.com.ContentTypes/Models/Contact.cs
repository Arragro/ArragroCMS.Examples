using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Models
{
    public class Contact
    {
        [MaxLength(100)]
        public string Title { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        [Required]
        [MaxLength(20)]
        [Phone]
        public string PhoneNumber { get; set; }
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; }
        [MaxLength(2000)]
        public string Gravitar { get; set; }

        [MaxLength(4000)]
        public string Bio { get; set; }
    }
}
