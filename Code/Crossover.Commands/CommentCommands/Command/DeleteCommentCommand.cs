using System.ComponentModel.DataAnnotations;
using MediatR;
using Crossover.Domain.Entities;

namespace Crossover.Commands.CommentCommands.Command 
{
    public class DeleteCommentCommand : IRequest
    {
        [Required(ErrorMessage = "The comment id is required!")]
        public int intIdComment { get; set; }
     
    }
}
