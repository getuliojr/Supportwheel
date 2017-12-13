using System.ComponentModel.DataAnnotations;
using MediatR;
using SupportWheel.Domain.Entities;

namespace SupportWheel.Commands.EngineerCommands.Command 
{
    public class DeleteEngineerCommand : IRequest
    {
        [Required(ErrorMessage = "The engineer id is required!")]
        public int intIdEngineer { get; set; }
     
    }
}
