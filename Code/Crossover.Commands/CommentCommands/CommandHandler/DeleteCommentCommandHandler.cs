using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using Crossover.Domain.Entities;
using Crossover.Utils.Security;
using Crossover.Commands.CommentCommands.Command;

namespace Crossover.Commands.CommentCommands.CommandHandler
{
    public class DeleteCommentCommandHandler : RequestHandler<DeleteCommentCommand>
    {
        private readonly DbContext _dbContext;

        public DeleteCommentCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        protected override void HandleCore(DeleteCommentCommand command)
        {
            var entity = Mapper.Map<Comment>(command);
            _dbContext.Set<Comment>().Attach(entity);

            //Set it as deleted
            _dbContext.Entry(entity).State = EntityState.Deleted;
            _dbContext.SaveChanges();
        }
    }
}
