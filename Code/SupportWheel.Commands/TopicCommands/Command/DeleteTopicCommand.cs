using System.ComponentModel.DataAnnotations;
using MediatR;
using SupportWheel.Domain.Entities;

namespace SupportWheel.Commands.TopicCommands.Command 
{
    public class DeleteTopicCommand : IRequest
    {
        [Required(ErrorMessage = "The topic id is required!")]
        public int intIdTopic { get; set; }
     
    }
}
