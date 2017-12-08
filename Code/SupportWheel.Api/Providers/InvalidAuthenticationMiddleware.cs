using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace SupportWheel.Api.Providers
{
    public class InvalidAuthenticationMiddleware : OwinMiddleware
    {
        public InvalidAuthenticationMiddleware(OwinMiddleware next)
            : base(next)
        {
        }

        public override async Task Invoke(IOwinContext context)
        {
            await Next.Invoke(context);
            //Responsable for 401 Error instead of 400 for Unauthenticated Users
            if (context.Response.StatusCode == 400 && context.Response.Headers.ContainsKey("AuthorizationResponse"))
            {
                context.Response.Headers.Remove("AuthorizationResponse");
                context.Response.StatusCode = 401;
            }
        }
    }
}