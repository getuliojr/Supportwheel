using SupportWheel.Queries.CommentQueries.QueryResult;
using MediatR;
using System.Collections.Generic;

namespace SupportWheel.Queries.CommentQueries.Query
{
    public class CommentByIdQuery : IRequest <CommentResult>
    {
        public int intIdComment { get; set; }

    }
}