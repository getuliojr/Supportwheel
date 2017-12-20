using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;
using MediatR;
using SupportWheel.Queries.EngineerQueries.Query;
using System.Security.Claims;
using System.Linq;
using System.Net.Http;
using SupportWheel.Commands.EngineerCommands.Command;


namespace SupportWheel.Api.Controllers
{
    
    [RoutePrefix("api/engineer")]
    public class EngineerController : ApiController
    {

        private readonly IMediator _mediator;

        public EngineerController(IMediator mediator)
        {
            _mediator = mediator;
        }

        //Create New 
        [Authorize]
        public IHttpActionResult PostEngineer([FromBody]CreateEngineerCommand command)
        {
            var response = _mediator.Send(command);

            return Ok(response);
        }

        //Get by ID
        public IHttpActionResult GetEngineer(int id)
        {
            var query = new EngineerByIdQuery
            {
                intIdEngineer = id
            };

            var response = _mediator.Send(query);

            return Ok(response);
        }

        //Get Many
        public IHttpActionResult GetEngineers([FromUri] AllEngineersQuery query)
        {
            if (query == null)
            {
                query = new AllEngineersQuery { };
            }

            var response = _mediator.Send(query);
            return Ok(response);
        }

        //Delete 
        [Authorize]
        public IHttpActionResult DeleteEngineer(int id)
        {
            var command = new DeleteEngineerCommand { intIdEngineer = id };

            var response = _mediator.Send(command);
            return Ok(response);
        }

        //Update 
        [Authorize]
        public IHttpActionResult PutEngineer(int id, [FromBody]UpdateEngineerCommand command)
        {
            command.intIdEngineer = id;
            var response = _mediator.Send(command);
            return Ok(response);
        }


    }
}
