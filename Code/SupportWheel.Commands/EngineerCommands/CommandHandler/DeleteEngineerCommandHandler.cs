using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using SupportWheel.Domain.Entities;
using SupportWheel.Utils.Security;
using SupportWheel.Commands.EngineerCommands.Command;

namespace SupportWheel.Commands.EngineerCommands.CommandHandler
{
    public class DeleteEngineerCommandHandler : RequestHandler<DeleteEngineerCommand>
    {
        private readonly DbContext _dbContext;

        public DeleteEngineerCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        protected override void HandleCore(DeleteEngineerCommand command)
        {
            var entity = Mapper.Map<Engineer>(command);
            _dbContext.Set<Engineer>().Attach(entity);

            //Set it as deleted
            _dbContext.Entry(entity).State = EntityState.Deleted;
            _dbContext.SaveChanges();
        }
    }
}
