using System.Data.Entity;
using System.Linq;
using AutoMapper.QueryableExtensions;
using MediatR;
using SupportWheel.Domain.Entities;
using SupportWheel.Queries.EngineerQueries.Query;
using SupportWheel.Queries.EngineerQueries.QueryResult;
using System.Collections.Generic;

namespace SupportWheel.Queries.EngineerQueries.QueryHandler
{
    public class EngineerByIdQueryHandler
    : IRequestHandler<EngineerByIdQuery, EngineerResult>
    {

        private readonly DbContext _dbContext;

        public EngineerByIdQueryHandler(DbContext context)
        {
           _dbContext = context;
        }


        public EngineerResult Handle(EngineerByIdQuery query)
        {
            var response = _dbContext
                                .Set<Engineer>()
                                .Where(t => t.intIdEngineer == query.intIdEngineer)
                                .Project().To<EngineerResult>()
                                .SingleOrDefault();

            return response;
        }
    }
}