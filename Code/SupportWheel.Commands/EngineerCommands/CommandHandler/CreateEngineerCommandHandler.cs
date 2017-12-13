using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using SupportWheel.Domain.Entities;
using SupportWheel.Utils.Security;
using SupportWheel.Commands.EngineerCommands.Command;

namespace SupportWheel.Commands.EngineerCommands.CommandHandler
{
    public class CreateEngineerCommandHandler : IRequestHandler<CreateEngineerCommand, Engineer>
    {
        private readonly DbContext _dbContext;

        public CreateEngineerCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        public Engineer Handle(CreateEngineerCommand command)
        {            
                var entity = Mapper.Map<Engineer>(command);
                _dbContext.Set<Engineer>().Add(entity);
                _dbContext.SaveChanges();
                return entity;
        }
    }
}
