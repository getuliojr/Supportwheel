using System.ComponentModel.DataAnnotations;
using MediatR;
using SupportWheel.Domain.Entities;
using System;

namespace SupportWheel.Commands.ScheduleCommands.Command 
{
    public class CreateScheduleCommand : IRequest<Schedule>
    {
        [Required(ErrorMessage = "The initial date to the draft is required!")]
        public DateTime dteSchedule { get; set; }

        [Required(ErrorMessage = "The initial period of the date is required!")]
        public int intPeriod { get; set; }

    }
}
