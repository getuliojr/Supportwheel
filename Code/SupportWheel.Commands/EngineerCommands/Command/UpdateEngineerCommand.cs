using System.ComponentModel.DataAnnotations;
using MediatR;
using SupportWheel.Domain.Entities;
using System;
using System.Collections.Generic;

namespace SupportWheel.Commands.EngineerCommands.Command
{
    public class UpdateEngineerCommand : IRequest<Engineer>
    {
        [Required(ErrorMessage = "The Id of the engineer being updated is required!")]
        public int intIdEngineer { get; set; }

        [Required(ErrorMessage = "The name of the engineer is required!")]
        public string strNameEngineer { get; set; }
    }
}