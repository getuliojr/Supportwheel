using System.Data.Entity;
using System.Linq;
using AutoMapper.QueryableExtensions;
using MediatR;
using Crossover.Domain.Entities;
using Crossover.Queries.UserQueries.Query;
using Crossover.Queries.UserQueries.QueryResult;
using Crossover.Utils.Security;

namespace Crossover.Queries.UserQueries.QueryHandler
{
    public class CurrentUserQueryHandler
    : IRequestHandler<CurrentUserQuery, CurrentUserResult>
    {

        private readonly DbContext _dbContext;

        public CurrentUserQueryHandler(DbContext context)
        {
           _dbContext = context;
        }


        public CurrentUserResult Handle(CurrentUserQuery query)
        {
            var response = _dbContext
                                .Set<User>()
                                .Where(u => u.intIdUser == query.intIdUser)
                                .Project().To<CurrentUserResult>()
                                .FirstOrDefault();

            return response;
        }
    }
}