using System;

namespace SupportWheel.Queries.ScheduleQueries.QueryResult
{
    public class ScheduleResult
    {

        public int intIdSchedule { get; set; }
        
        public int intIdEngineer { get; set; }
        public string strNameEngineer { get; set; }
        public DateTime dteSchedule { get; set; }
        public int intPeriod { get; set; }
        
        public int intIdUserCreated { get; set; }
        public string strFullNameCreated { get; set; }
        public DateTime dteCreated { get; set; }
        public int intTotalRecords { get; set; }

    }



}