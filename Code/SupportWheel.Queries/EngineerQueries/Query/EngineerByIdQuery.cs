using SupportWheel.Queries.EngineerQueries.QueryResult;
using MediatR;
using System.Collections.Generic;

namespace SupportWheel.Queries.EngineerQueries.Query
{
    public class EngineerByIdQuery : IRequest <EngineerResult>
    {
        public int intIdEngineer { get; set; }

    }
}