using System;
using System.Data.Entity;
using AutoMapper;
using MediatR;
using SupportWheel.Commands.EngineerCommands.Command;
using SupportWheel.Domain.Entities;

namespace SupportWheel.Commands.EngineerCommands.CommandHandler
{
    public class UpdateEngineerCommandHandler : IRequestHandler<UpdateEngineerCommand, Engineer>
    {
        private readonly DbContext _dbContext;

        public UpdateEngineerCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        public Engineer Handle(UpdateEngineerCommand command)
        {
            var entity = Mapper.Map<Engineer>(command);
            _dbContext.Set<Engineer>().Attach(entity);

            //Marca tudo como modificado, NULLs irão apagar o que estava antes
            _dbContext.Entry(entity).State = EntityState.Modified;

            //Marca como não modificado o que é NULL, para não ser atualizado na base
            foreach (var propertyName in _dbContext.Entry(entity).OriginalValues.PropertyNames)
            {
                //Se a propriedade não existir nos dados enviados ou foi passado null, não atualiza
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