using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using Crossover.Domain.Entities;
using Crossover.Utils.Security;
using Crossover.Commands.TopicCommands.Command;

namespace Crossover.Commands.TopicCommands.CommandHandler
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
