using SupportWheel.Api.Hubs;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;


namespace SupportWheel.Api.Filters
{
    public class SignalRHandler : DelegatingHandler
    {
        async protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
        {
            HttpResponseMessage response = await base.SendAsync(request, cancellationToken);
            
            //After the response is about to be sent to the user, dispatch a Hub Event if success
            if (response.IsSuccessStatusCode && 
                (request.Method == HttpMethod.Post || request.Method == HttpMethod.Put || request.Method == HttpMethod.Delete)) 
            {
                if (response.Content.Headers.ContentType.MediaType == "application/json")
                {
                    string[] path = request.RequestUri.AbsolutePath.Split('/');
                    var resourceName = path[2]; //The name after the '/api/'

                    //Check if the ConnectionId is available at the headers]
                    if (request.Headers.Contains("ConnectionId"))
                    {
                        List<string> excludeOwnConnectionId = new List<string>(request.Headers.GetValues("ConnectionId"));

                        var hub = GlobalHost.ConnectionManager.GetHubContext<ApiHub>();
                        var subscribed = hub.Clients.Group(resourceName, excludeOwnConnectionId.ToArray());

                        //Get Response as an object (json)
                        object responseMessage;
                        response.TryGetContentValue(out responseMessage);



                        //Notify subscribers of the hub about an insert, update or delete with success
                        if (request.Method == HttpMethod.Post)
                        {
                            subscribed.inserted(resourceName, responseMessage);
                        }
                        else if (request.Method == HttpMethod.Put)
                        {
                            subscribed.updated(resourceName, responseMessage);
                        }
                        else if (request.Method == HttpMethod.Delete)
                        {
                            subscribed.deleted(resourceName, responseMessage);
                        }
                    }

                }
            }
            
            // let the response continue its normal path
            return response;
        }

    }
}