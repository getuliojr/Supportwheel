using Crossover.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crossover.Domain
{
    public abstract class AuditableEntity
    {
        [ForeignKey("UserCreated")] 
        public int intIdUserCreated { get; set; }
        public virtual User UserCreated { get; set; }

        public DateTime dteCreated { get; set; }

        public int? intIdUserModified { get; set; }

        public DateTime? dteModified { get; set; }

    }
}
