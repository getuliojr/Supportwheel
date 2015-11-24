using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace Crossover.Api.Hubs
{
    public class ApiHub : Hub
    {
        public async void Subscribe(string resource)
        {
            await Groups.Add(Context.ConnectionId, resource);
        }

        public async void Unsubscribe(string resource)
        {
            await Groups.Remove(Context.ConnectionId, resource);
        }
    }

}
