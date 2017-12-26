using System.Web.Http;
using MediatR;
using SupportWheel.Queries.ScheduleQueries.Query;
using SupportWheel.Commands.ScheduleCommands.Command;
using AutoMapper;
using SupportWheel.Queries.ScheduleQueries.QueryResult;
using SupportWheel.Api.Hubs;

namespace SupportWheel.Api.Controllers
{
    
    [RoutePrefix("api/schedule")]
    public class ScheduleController : HubApiController<ApiHub>
    {

        private readonly IMediator _mediator;

        public ScheduleController(IMediator mediator)
        {
            _mediator = mediator;
        }

        //Create New
        [Authorize]
        public IHttpActionResult PostSchedule([FromBody]CreateScheduleCommand command)
        {
            var response = _mediator.Send(command);
            var filteredResponse = Mapper.Map<ScheduleResult>(response);

            return Ok(filteredResponse);
        }

        //Get Many
        public IHttpActionResult GetSchedules([FromUri] SchedulesQuery query)
        {
            if (query == null)
            {
                query = new SchedulesQuery { };
            }

            var response = _mediator.Send(query);
            return Ok(response);
        }

        //Delete 
        [Authorize]
        public IHttpActionResult DeleteSchedule()
        {
            var command = new DeleteScheduleCommand { };
           
            var response = _mediator.Send(command);
            return Ok(response);
        }

        
    }
}
