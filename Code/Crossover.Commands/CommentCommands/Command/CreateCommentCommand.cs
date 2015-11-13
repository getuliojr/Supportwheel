using System.ComponentModel.DataAnnotations;
using MediatR;
using Crossover.Domain.Entities;

namespace Crossover.Commands.CommentCommands.Command 
{
    public class CreateCommentCommand : IRequest<Comment>
    {
        [Required(ErrorMessage = "The Topic Id is required!")]
        public int intIdTopic { get; set; }

        [Required(ErrorMessage = "The comment is required!")]
        public string txtComment { get; set; }
      
    }
}
