using SupportWheel.Queries.ScheduleQueries.QueryResult;
using MediatR;
using System.Collections.Generic;

namespace SupportWheel.Queries.ScheduleQueries.Query
{
    public class SchedulesQuery : IRequest <IEnumerable<ScheduleResult>>
    {
        public int? intPageSize { get; set; }
        public int? intPageNumber { get; set; }

    }
}