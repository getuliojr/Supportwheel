using SupportWheel.Queries.EngineerQueries.QueryResult;
using MediatR;
using System.Collections.Generic;

namespace SupportWheel.Queries.EngineerQueries.Query
{
    public class AllEngineersQuery : IRequest <IEnumerable<EngineerResult>>
    {


    }
}