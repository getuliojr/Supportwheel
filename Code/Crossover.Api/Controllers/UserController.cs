using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;
using MediatR;
using Crossover.Queries.UserQueries.Query;
using System.Security.Claims;
using System.Linq;
using System.Net.Http;
using Crossover.Commands.UserCommands.Command;


namespace Crossover.Api.Controllers
{
    
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {

        private readonly IMediator _mediator;

        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        //Create New User
        [Route("")]
        public IHttpActionResult PostUser([FromBody]CreateUserCommand command)
        {
            var resposta = _mediator.Send(command);

            return Ok(resposta);
        }

        //Get user by ID
        [Route("{id:int}")]
        [Authorize]
        public IHttpActionResult GetUser(int id)
        {
            var query = new CurrentUserQuery
            {
                intIdUser = id
            };

            var response = _mediator.Send(query);

            return Ok(response);
        }

        //Get user from Token
        [Route("current")]
        [Authorize]
        public IHttpActionResult GetCurrentUser()
        {
             ClaimsPrincipal principal = Request.GetRequestContext().Principal as ClaimsPrincipal;
             var intIdUser = principal.Claims.Where(c => c.Type == "intIdUser").Single().Value;

            var CurrentUserQuery = new CurrentUserQuery
            {
                intIdUser = Convert.ToInt32(intIdUser)
            };

            var response = _mediator.Send(CurrentUserQuery);

            return Ok(response);

        }
    }
}
