using MediatR;
using Crossover.Queries.UserQueries.QueryResult;

namespace Crossover.Queries.UserQueries.Query
{
    public class CurrentUserQuery : IRequest <CurrentUserResult>
    {

        public int intIdUser { get; set; }

    }
}