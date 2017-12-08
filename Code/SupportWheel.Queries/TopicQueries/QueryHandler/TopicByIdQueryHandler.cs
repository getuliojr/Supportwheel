using System.Data.Entity;
using System.Linq;
using AutoMapper.QueryableExtensions;
using MediatR;
using SupportWheel.Domain.Entities;
using SupportWheel.Queries.TopicQueries.Query;
using SupportWheel.Queries.TopicQueries.QueryResult;
using System.Collections.Generic;

namespace SupportWheel.Queries.TopicsQueries.QueryHandler
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