using Crossover.Queries.TopicQueries.QueryResult;
using MediatR;
using System.Collections.Generic;

namespace Crossover.Queries.TopicQueries.Query
{
    public class AllTopicsQuery : IRequest <IEnumerable<AllTopicsResult>>
    {


    }
}