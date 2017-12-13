using System.ComponentModel.DataAnnotations;
using MediatR;
using SupportWheel.Domain.Entities;

namespace SupportWheel.Commands.EngineerCommands.Command 
{
    public class CreateEngineerCommand : IRequest<Engineer>
    {
        [Required(ErrorMessage = "The name of the engineer is required!")]
        public string strNameEngineer { get; set; }
      
    }
}
