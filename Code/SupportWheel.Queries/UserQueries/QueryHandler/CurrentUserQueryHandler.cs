using System.Data.Entity;
using System.Linq;
using AutoMapper.QueryableExtensions;
using MediatR;
using SupportWheel.Domain.Entities;
using SupportWheel.Queries.UserQueries.Query;
using SupportWheel.Queries.UserQueries.QueryResult;
using SupportWheel.Utils.Security;

namespace SupportWheel.Queries.UserQueries.QueryHandler
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