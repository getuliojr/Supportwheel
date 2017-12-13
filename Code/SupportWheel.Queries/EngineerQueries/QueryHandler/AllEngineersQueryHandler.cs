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
    public class AllEngineersQueryHandler
    : IRequestHandler<AllEngineersQuery, IEnumerable<EngineerResult>>
    {

        private readonly DbContext _dbContext;

        public AllEngineersQueryHandler(DbContext context)
        {
           _dbContext = context;
        }


        public IEnumerable<EngineerResult> Handle(AllEngineersQuery query)
        {
            var response = _dbContext
                                .Set<Engineer>()
                                .Project().To<EngineerResult>();

            return response;
        }
    }
}