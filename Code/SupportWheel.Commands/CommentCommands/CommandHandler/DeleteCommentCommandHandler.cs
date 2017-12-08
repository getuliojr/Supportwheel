using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using SupportWheel.Domain.Entities;
using SupportWheel.Utils.Security;
using SupportWheel.Commands.CommentCommands.Command;

namespace SupportWheel.Commands.CommentCommands.CommandHandler
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
