using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using SupportWheel.Domain.Entities;
using SupportWheel.Utils.Security;
using SupportWheel.Commands.CommentCommands.Command;

namespace SupportWheel.Commands.CommentCommands.CommandHandler
{
    public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, Comment>
    {
        private readonly DbContext _dbContext;

        public CreateCommentCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        public Comment Handle(CreateCommentCommand command)
        {            
                var entity = Mapper.Map<Comment>(command);
                _dbContext.Set<Comment>().Add(entity);
                _dbContext.SaveChanges();
                return entity;
        }
    }
}
