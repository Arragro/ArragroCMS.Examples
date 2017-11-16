using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Models
{
    public class SvgIconLink
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
    }
}
