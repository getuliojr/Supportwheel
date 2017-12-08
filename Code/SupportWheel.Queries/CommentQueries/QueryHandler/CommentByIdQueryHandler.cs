using System.Data.Entity;
using System.Linq;
using AutoMapper.QueryableExtensions;
using MediatR;
using SupportWheel.Domain.Entities;
using SupportWheel.Queries.CommentQueries.Query;
using SupportWheel.Queries.CommentQueries.QueryResult;
using System.Collections.Generic;

namespace SupportWheel.Queries.CommentQueries.QueryHandler
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