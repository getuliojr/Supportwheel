using System.ComponentModel.DataAnnotations;
using MediatR;
using SupportWheel.Domain.Entities;

namespace SupportWheel.Commands.CommentCommands.Command 
{
    public class CreateCommentCommand : IRequest<Comment>
    {
        [Required(ErrorMessage = "The Topic Id is required!")]
        public int intIdTopic { get; set; }

        [Required(ErrorMessage = "The comment is required!")]
        public string txtComment { get; set; }
      
    }
}
