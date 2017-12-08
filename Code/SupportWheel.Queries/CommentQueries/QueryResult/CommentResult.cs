using System;

namespace SupportWheel.Queries.CommentQueries.QueryResult
{
    public class CommentResult
    {
      
        public int intIdComment { get; set; }
        public int intIdTopic { get; set; }
        public string txtComment { get; set; }
        public int intIdUserCreated { get; set; }
        public string strFullNameCreated { get; set; }
        public DateTime dteCreated { get; set; }
        
    }



}