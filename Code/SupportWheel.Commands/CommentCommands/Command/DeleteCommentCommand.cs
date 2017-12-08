using System.ComponentModel.DataAnnotations;
using MediatR;
using SupportWheel.Domain.Entities;

namespace SupportWheel.Commands.CommentCommands.Command 
{
    public class DeleteCommentCommand : IRequest
    {
        [Required(ErrorMessage = "The comment id is required!")]
        public int intIdComment { get; set; }
     
    }
}
