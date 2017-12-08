using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using SupportWheel.Domain.Entities;
using SupportWheel.Utils.Security;
using SupportWheel.Commands.TopicCommands.Command;

namespace SupportWheel.Commands.TopicCommands.CommandHandler
{
    public class CreateTopicCommandHandler : IRequestHandler<CreateTopicCommand, Topic>
    {
        private readonly DbContext _dbContext;

        public CreateTopicCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        public Topic Handle(CreateTopicCommand command)
        {            
                var entity = Mapper.Map<Topic>(command);
                _dbContext.Set<Topic>().Add(entity);
                _dbContext.SaveChanges();
                return entity;
        }
    }
}
