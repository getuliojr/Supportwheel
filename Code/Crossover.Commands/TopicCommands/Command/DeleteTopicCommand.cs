using System.ComponentModel.DataAnnotations;
using MediatR;
using Crossover.Domain.Entities;

namespace Crossover.Commands.TopicCommands.Command 
{
    public class DeleteTopicCommand : IRequest
    {
        [Required(ErrorMessage = "The topic id is required!")]
        public int intIdTopic { get; set; }
     
    }
}
