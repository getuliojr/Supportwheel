using System;
using System.ComponentModel.DataAnnotations;
using MediatR;
using SupportWheel.Domain.Entities;

namespace SupportWheel.Commands.ScheduleCommands.Command 
{
    public class DeleteScheduleCommand : IRequest
    {
        [Required(ErrorMessage = "The inicial date to delete the schedules, is required!")]
        public DateTime dteSchedule { get; set; }
     
    }
}
