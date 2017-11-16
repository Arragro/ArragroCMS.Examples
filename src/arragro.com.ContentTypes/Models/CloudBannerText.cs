using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Models
{
    public class CloudBannerText
    {
        [Required]
        [MaxLength(200)]
        public string Markdown { get; set; }
    }
}
