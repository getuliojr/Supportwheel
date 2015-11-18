using System.Web.Http;
using Microsoft.Owin;
using Owin;
using Microsoft.Owin.Cors;
using MediatR;
using Microsoft.AspNet.SignalR;

[assembly: OwinStartup(typeof(Crossover.Api.Startup))]
namespace Crossover.Api
{
    public class Startup
    {

        public void Configuration(IAppBuilder app)
        {
            

            // Branch the pipeline here for requests that start with "/signalr"
            app.Map("/signalr", map =>
            {
                // Setup the CORS middleware to run before SignalR.
                // By default this will allow all origins. You can 
                // configure the set of origins and/or http verbs by
                // providing a cors options with a different policy.
                map.UseCors(CorsOptions.AllowAll);
                var hubConfiguration = new HubConfiguration
                {
                    // You can enable JSONP by uncommenting line below.
                    // JSONP requests are insecure but some older browsers (and some
                    // versions of IE) require JSONP to work cross domain
                    // EnableJSONP = true
                };
                // Run the SignalR pipeline. We're not using MapSignalR
                // since this branch already runs under the "/signalr"
                // path.
                map.RunSignalR(hubConfiguration);
            });
            app.UseCors(CorsOptions.AllowAll); //Enable Cors globally for all domains

            //app.MapSignalR(hubconfig);

            HttpConfiguration config = new HttpConfiguration();
            AutoMapperConfig.RegisterMappings();
            AutofacConfig.Register(config, app);
            OauthConfig.Register(config, app);
            WebApiConfig.Register(config);
            app.UseWebApi(config);            
        }

    }
}