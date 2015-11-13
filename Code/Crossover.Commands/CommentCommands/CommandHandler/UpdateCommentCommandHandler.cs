using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using Crossover.Domain.Entities;
using Crossover.Utils.Security;
using Crossover.Commands.CommentCommands.Command;

namespace Crossover.Commands.CommentCommands.CommandHandler
{
    public class UpdateCommentCommandHandler : IRequestHandler<UpdateCommentCommand, Comment>
    {
        private readonly DbContext _dbContext;

        public UpdateCommentCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        public Comment Handle(UpdateCommentCommand command)
        {
            var entity = Mapper.Map<Comment>(command);
            _dbContext.Set<Comment>().Attach(entity);

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
