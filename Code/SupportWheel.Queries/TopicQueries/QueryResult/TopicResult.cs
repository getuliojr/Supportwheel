using SupportWheel.Queries.CommentQueries.QueryResult;
using System;
using System.Collections.Generic;

namespace SupportWheel.Queries.TopicQueries.QueryResult
{
    public class TopicResult
    {
      
        public int intIdTopic { get; set; }
        public string strTitle { get; set; }
        public string txtDescription { get; set; }
        public int intIdUserCreated { get; set; }
        public string strFullNameCreated { get; set; }
        public DateTime dteCreated { get; set; }

        //Lista de Comentários
        public IList<CommentResult> comments { get; set; }
    }



}