using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace SupportWheel.Domain.Entities
{
    public class Topic : AuditableEntity
    {
        [Key]
        public int intIdTopic { get; set; }

        [Required]
        [StringLength(150)]
        public string strTitle { get; set; }

        [Required]
        [MaxLength]
        public string txtDescription { get; set; }

        public virtual ICollection<Comment> Comments { get; set; }

    }
}
