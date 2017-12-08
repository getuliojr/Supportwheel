using System;

namespace SupportWheel.Queries.TopicQueries.QueryResult
{
    public class AllTopicsResult
    {
      
        public int intIdTopic { get; set; }
        public string strTitle { get; set; }
        public string txtDescription { get; set; }
        public int intIdUserCreated { get; set; }
        public string strFullNameCreated { get; set; }
        public DateTime dteCreated { get; set; }
        public int intQtyComments { get; set; }

    }



}