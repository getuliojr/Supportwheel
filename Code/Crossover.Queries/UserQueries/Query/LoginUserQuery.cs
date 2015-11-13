using MediatR;
using Crossover.Queries.UserQueries.QueryResult;

namespace Crossover.Queries.UserQueries.Query
{
    public class LoginUserQuery : IRequest <LoginUserResult>
    {
        
        public string strEmail { get; set; }
        public string strPassword { get; set; }

    }
}