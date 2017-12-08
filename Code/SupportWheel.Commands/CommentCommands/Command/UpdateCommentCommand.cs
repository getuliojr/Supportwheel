using System.ComponentModel.DataAnnotations;
using MediatR;
using SupportWheel.Domain.Entities;

namespace SupportWheel.Commands.CommentCommands.Command 
{
    public class UpdateCommentCommand : IRequest<Comment>
    {
        [Required(ErrorMessage = "The Comment Id is required!")]
        public int intIdComment { get; set; }

        [Required(ErrorMessage = "The comment is required!")]
        public string txtComment { get; set; }
      
    }
}
