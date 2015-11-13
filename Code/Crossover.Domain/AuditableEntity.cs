using Crossover.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crossover.Domain
{
    public abstract class AuditableEntity
    {
        [ForeignKey("UserCreated")] 
        public Int32 intIdUserCreated { get; set; }
        public virtual User UserCreated { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime dteCreated { get; set; }

        public Int32? intIdUserModified { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime? dteModified { get; set; }

    }
}
