using SupportWheel.Queries.TopicQueries.QueryResult;
using MediatR;
using System.Collections.Generic;

namespace SupportWheel.Queries.TopicQueries.Query
{
    public class TopicByIdQuery : IRequest <TopicResult>
    {
        public int intIdTopic { get; set; }

    }
}