using System.Data.Entity;
using System.Linq;
using AutoMapper.QueryableExtensions;
using MediatR;
using Crossover.Domain.Entities;
using Crossover.Queries.CommentQueries.Query;
using Crossover.Queries.CommentQueries.QueryResult;
using System.Collections.Generic;

namespace Crossover.Queries.CommentQueries.QueryHandler
{
    public class CommentByIdQueryHandler
    : IRequestHandler<CommentByIdQuery, CommentResult>
    {

        private readonly DbContext _dbContext;

        public CommentByIdQueryHandler(DbContext context)
        {
           _dbContext = context;
        }


        public CommentResult Handle(CommentByIdQuery query)
        {
            var response = _dbContext
                                .Set<Comment>()
                                .Where(t => t.intIdComment == query.intIdComment)
                                .Project().To<CommentResult>()
                                .SingleOrDefault();

            return response;
        }
    }
}