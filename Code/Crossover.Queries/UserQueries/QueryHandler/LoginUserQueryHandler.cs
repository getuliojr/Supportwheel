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
    public class LoginUserQueryHandler
    : IRequestHandler<LoginUserQuery, LoginUserResult>
    {

        private readonly DbContext _dbContext;

        public LoginUserQueryHandler(DbContext context)
        {
           _dbContext = context;
        }


        public LoginUserResult Handle(LoginUserQuery query)
        {
            var response = _dbContext
                                .Set<User>()
                                .Project().To<LoginUserResult>()
                                .FirstOrDefault(s => s.strEmail == query.strEmail);

            if (response != null)
            {
                if (PasswordHash.ValidatePassword(query.strPassword, response.strPassword))
                {
                    return response;
                }
            }

            return null;
        }
    }
}