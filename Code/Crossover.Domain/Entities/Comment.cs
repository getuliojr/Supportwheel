using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Crossover.Domain.Entities
{
    public class Comment : AuditableEntity
    {
        [Key]
        public int intIdComment { get; set; }

        //[ForeignKey("Topic")]
        public int intIdTopic { get; set; }
        //public virtual Topic Topic { get; set; }

        [Required]
        [MaxLength]
        public string txtComment { get; set; }

    }
}
