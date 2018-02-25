using System.ComponentModel.DataAnnotations;

namespace arragro.com.ContentTypes.Models
{
    public class Tile
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public bool SvgBased { get; set; }

        [MaxLength(2000)]
        public string ImageUrl { get; set; }
        [MaxLength(512)]
        public string ImageUrlAlt { get; set; }

        public bool HasLink { get; set; }
        [MaxLength(100)]
        public string LinkText { get; set; }
        [MaxLength(2000)]
        public string Href { get; set; }
        [MaxLength(4000)]
        public string Markdown { get; set; }
        [MaxLength(30)]
        public string CssClass { get; set; }

    }
}
