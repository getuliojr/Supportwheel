using System.Web.Http;
using Microsoft.Owin;
using Owin;
using MediatR;

[assembly: OwinStartup(typeof(Crossover.Api.Startup))]
namespace Crossover.Api
{
    public class Startup
    {

        public void Configuration(IAppBuilder app)
        {
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll); //Enable Cors globally for all domains
            HttpConfiguration config = new HttpConfiguration();
            AutoMapperConfig.RegisterMappings();
            AutofacConfig.Register(config, app);
            OauthConfig.Register(config, app);
            WebApiConfig.Register(config);
            app.UseWebApi(config);            
        }

    }
}