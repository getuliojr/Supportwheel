using System.ComponentModel.DataAnnotations;

namespace Crossover.Domain.Entities
{
    public class User : AuditableEntity
    {
        [Key]
        public int intIdUser { get; set; }

        [Required]
        [StringLength(100)]
        public string strFullName { get; set; }

        [Required]
        [StringLength(100)]
        public string strEmail { get; set; }

        [Required]
        [StringLength(128)]
        public string strPassword { get; set; }

    }
}
