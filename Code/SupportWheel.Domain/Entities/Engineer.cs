using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace SupportWheel.Domain.Entities
{
    public class Engineer : AuditableEntity
    {
        [Key]
        public int intIdEngineer { get; set; }

        [Required]
        [StringLength(50)]
        public string strNameEngineer { get; set; }

    }
}
