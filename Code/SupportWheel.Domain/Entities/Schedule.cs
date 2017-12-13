using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace SupportWheel.Domain.Entities
{
    public class Schedule : AuditableEntity
    {
        [Key]
        public int intIdSchedule { get; set; }

        [Required]
        [ForeignKey("Engineer")]
        public int intIdEngineer { get; set; }
        public virtual Engineer Engineer { get; set; }

        [Required]
        [Column(TypeName = "smalldatetime")]
        public DateTime dteSchedule { get; set; }

        [Required]
        public int intPeriod { get; set; }

    }
}
