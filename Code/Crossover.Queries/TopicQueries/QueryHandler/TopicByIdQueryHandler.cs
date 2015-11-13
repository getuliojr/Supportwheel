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
    public class TopicByIdQueryHandler
    : IRequestHandler<TopicByIdQuery, TopicResult>
    {

        private readonly DbContext _dbContext;

        public TopicByIdQueryHandler(DbContext context)
        {
           _dbContext = context;
        }


        public TopicResult Handle(TopicByIdQuery query)
        {
            var response = _dbContext
                                .Set<Topic>()
                                .Where(t => t.intIdTopic == query.intIdTopic)
                                .Project().To<TopicResult>()
                                .SingleOrDefault();

            return response;
        }
    }
}