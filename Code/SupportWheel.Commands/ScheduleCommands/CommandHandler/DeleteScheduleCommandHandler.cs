using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using SupportWheel.Domain.Entities;
using SupportWheel.Utils.Security;
using SupportWheel.Commands.ScheduleCommands.Command;
using System.Linq;

namespace SupportWheel.Commands.ScheduleCommands.CommandHandler
{
    public class DeleteScheduleCommandHandler : RequestHandler<DeleteScheduleCommand>
    {
        private readonly DbContext _dbContext;

        public DeleteScheduleCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        protected override void HandleCore(DeleteScheduleCommand command)
        {
            var db = _dbContext.Set<Schedule>();

            //Delete all schedule dates higher than the received date
            db.RemoveRange(db);
            _dbContext.SaveChanges();
        }
    }
}
