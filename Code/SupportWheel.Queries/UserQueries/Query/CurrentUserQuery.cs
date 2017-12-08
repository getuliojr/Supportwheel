using MediatR;
using SupportWheel.Queries.UserQueries.QueryResult;

namespace SupportWheel.Queries.UserQueries.Query
{
    public class CurrentUserQuery : IRequest <CurrentUserResult>
    {

        public int intIdUser { get; set; }

    }
}