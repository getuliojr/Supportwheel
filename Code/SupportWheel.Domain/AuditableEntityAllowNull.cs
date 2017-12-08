using SupportWheel.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupportWheel.Domain
{
    public abstract class AuditableEntityAllowNull
    {
        [ForeignKey("UserCreated")] 
        public int? intIdUserCreated { get; set; }
        public virtual User UserCreated { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime dteCreated { get; set; }

        public int? intIdUserModified { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime? dteModified { get; set; }

    }
}
