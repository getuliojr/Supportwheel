using System.Web.Http;
using Microsoft.Owin;
using Owin;
[assembly: OwinStartup(typeof(SupportWheel.Api.Startup))]
namespace SupportWheel.Api
{
    public class Startup
    {

        public void Configuration(IAppBuilder app)
        {

            HttpConfiguration config = new HttpConfiguration();

            AutoMapperConfig.RegisterMappings();
            AutofacConfig.Register(config, app);
            OauthConfig.Register(config, app);
            WebApiConfig.Register(config);

            app.MapSignalR();
            app.UseWebApi(config);

        }

    }
}