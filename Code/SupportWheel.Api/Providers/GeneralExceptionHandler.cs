using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;

namespace SupportWheel.Api.Providers
{
    public class GeneralExceptionHandler : ExceptionHandler
    {
        public override void Handle(ExceptionHandlerContext context)
        {

            var ErrorMessage = "";
            
            //Entity Erros
            if (context.Exception.GetType().Name == "DbEntityValidationException")
            {
                DbEntityValidationException dbEntityException = (DbEntityValidationException)context.Exception;

                foreach (var failure in dbEntityException.EntityValidationErrors)
                {
                    StringBuilder sb = new StringBuilder();

                    foreach (var validationError in failure.ValidationErrors)
                    {
                        sb.AppendFormat("{0} failed validation\n", failure.Entry.Entity.GetType());
                        foreach (var error in failure.ValidationErrors)
                        {
                            sb.AppendFormat("- {0} : {1}", error.PropertyName, error.ErrorMessage);
                            sb.AppendLine();
                        }
                    }
                    ErrorMessage = sb.ToString();
                }
            }
            else
            {
                //Not Specific Erros, Capture here

                if (context.Exception.InnerException != null)
                {
                    StringBuilder sb = new StringBuilder();
                    Exception ex = context.Exception;
                    while(ex.InnerException != null)
                    {
                        //Get All InnerExceptions Level
                        sb.AppendLine(ex.InnerException.Message);
                        ex = ex.InnerException;
                    }
                    ErrorMessage = sb.ToString();
                }
                else
                {
                    ErrorMessage = context.Exception.Message;
                }
            }

            context.Result = new GeneralErrorResult
            {
                Request = context.ExceptionContext.Request,
                Content = ErrorMessage
            };
        }


        public class GeneralErrorResult : IHttpActionResult
        {
            public HttpRequestMessage Request { get; set; }
            public string Content { get; set; }

            public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
            {
                HttpResponseMessage response =
                    new HttpResponseMessage(HttpStatusCode.InternalServerError);
                response.Content = new StringContent(Content);
                response.RequestMessage = Request;
                return Task.FromResult(response);
            }
        }
    }
}