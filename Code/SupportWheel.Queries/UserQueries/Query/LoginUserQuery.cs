using MediatR;
using SupportWheel.Queries.UserQueries.QueryResult;

namespace SupportWheel.Queries.UserQueries.Query
{
    public class LoginUserQuery : IRequest <LoginUserResult>
    {
        
        public string strEmail { get; set; }
        public string strPassword { get; set; }

    }
}