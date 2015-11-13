using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Cors;
using Newtonsoft.Json.Serialization;
using Owin;
using Microsoft.Owin.Security.OAuth;
using System.Web.Http.Routing;
using System.Web.Http.Controllers;
using Crossover.Api.Filters;
using System.Web.Http.ExceptionHandling;
using Crossover.Api.Providers;

namespace Crossover.Api
{
    public class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //Configure WebApi to accept only a Bearer Token
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            config.Filters.Add(new ValidateModelAttribute()); //Validate that models are valid and not null
            
            //Global Exception Handler
            config.Services.Replace(typeof(IExceptionHandler), new GeneralExceptionHandler());

            // Web API routes
            config.MapHttpAttributeRoutes();
            
            //Default Route
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            config.Formatters.XmlFormatter.SupportedMediaTypes.Clear(); //Remove o XML, deixando apenas JSON
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}