using System.Data.Entity;
using System.Linq;
using AutoMapper.QueryableExtensions;
using MediatR;
using Crossover.Domain.Entities;
using Crossover.Queries.TopicQueries.Query;
using Crossover.Queries.TopicQueries.QueryResult;
using System.Collections.Generic;

namespace Crossover.Queries.TopicsQueries.QueryHandler
{
    public class AllTopicsQueryHandler
    : IRequestHandler<AllTopicsQuery, IEnumerable<AllTopicsResult>>
    {

        private readonly DbContext _dbContext;

        public AllTopicsQueryHandler(DbContext context)
        {
           _dbContext = context;
        }


        public IEnumerable<AllTopicsResult> Handle(AllTopicsQuery query)
        {
            var response = _dbContext
                                .Set<Topic>()
                                .Project().To<AllTopicsResult>();

            return response;
        }
    }
}