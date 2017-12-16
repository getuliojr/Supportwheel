using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;
using MediatR;
using SupportWheel.Queries.UserQueries.Query;
using System.Security.Claims;
using System.Linq;
using System.Net.Http;
using SupportWheel.Commands.UserCommands.Command;
using AutoMapper;
using SupportWheel.Queries.UserQueries.QueryResult;

namespace SupportWheel.Api.Controllers
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
        public IHttpActionResult PostUser([FromBody]CreateUserCommand command)
        {
            var resposta = _mediator.Send(command);
            var filteredResponse = Mapper.Map<CurrentUserResult>(resposta);
            return Ok(resposta);
        }

        //Get user by ID
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
