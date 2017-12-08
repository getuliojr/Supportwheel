using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using SupportWheel.Domain.Entities;
using SupportWheel.Utils.Security;
using SupportWheel.Commands.TopicCommands.Command;

namespace SupportWheel.Commands.TopicCommands.CommandHandler
{
    public class UpdateTopicCommandHandler : IRequestHandler<UpdateTopicCommand, Topic>
    {
        private readonly DbContext _dbContext;

        public UpdateTopicCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        public Topic Handle(UpdateTopicCommand command)
        {
            var entity = Mapper.Map<Topic>(command);
            _dbContext.Set<Topic>().Attach(entity);

            //Set is updated, nulls erase what was before
            _dbContext.Entry(entity).State = EntityState.Modified;

            //Mark as not modified what is NULL, so it does not update in the database
            foreach (var propertyName in _dbContext.Entry(entity).OriginalValues.PropertyNames)
            {
                //If the property does not exist in the data sent or has been passed a value of null, do not update
                if (command.GetType().GetProperty(propertyName) == null || _dbContext.Entry(entity).Property(propertyName).CurrentValue == null)
                {
                    _dbContext.Entry(entity).Property(propertyName).IsModified = false;
                }
            }

            _dbContext.SaveChanges();
            return entity;
        }
    }
}
