using System;
using SupportWheel.Domain.Entities;
using MediatR;
using SupportWheel.Commands.UserCommands.Command;
using System.Data.Entity;
using AutoMapper;
using SupportWheel.Utils.Security;

namespace SupportWheel.Commands.UserCommands.CommandHandler
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, User>
    {
        private readonly DbContext _dbContext;

        public CreateUserCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        public User Handle(CreateUserCommand command)
        {
            //Hash Password before inserting
            command.strPassword = PasswordHash.CreateHash(command.strPassword);

            try
            {
                var entity = Mapper.Map<User>(command);
                _dbContext.Set<User>().Add(entity);
                _dbContext.SaveChanges();
                return entity;
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
            {
                Exception raise = dbEx;
                foreach (var validationErrors in dbEx.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        string message = string.Format("{0}:{1}",
                            validationErrors.Entry.Entity.ToString(),
                            validationError.ErrorMessage);
                        // raise a new exception nesting
                        // the current instance as InnerException
                        raise = new InvalidOperationException(message, raise);
                    }
                }
                throw raise;
            }
        }
    }
}
