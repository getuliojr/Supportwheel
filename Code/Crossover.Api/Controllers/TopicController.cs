using System.Web.Http;
using MediatR;
using Crossover.Commands.TopicCommands.Command;
using Crossover.Queries.TopicQueries.Query;
using Crossover.Api.Hubs;

namespace Crossover.Api.Controllers
{

    [RoutePrefix("api/topic")]
    public class TopicController : HubApiController<ApiHub>
    {

        private readonly IMediator _mediator;
        public TopicController(IMediator mediator)
        {
            _mediator = mediator;
        }

        //Create New Topic
        [Route("")]
        [Authorize]
        public IHttpActionResult PostTopic([FromBody]CreateTopicCommand command)
        {
            var resposta = _mediator.Send(command);
            return Ok(resposta);
        }

        //Get All Topics
        [Route("")]
        [AllowAnonymous]
        public IHttpActionResult GetTopics()
        {
            var query = new AllTopicsQuery();
            
            var response = _mediator.Send(query);

            return Ok(response);
        }


        //Get one Topic by ID
        [Route("{id:int}")]
        [Authorize]
        public IHttpActionResult GetTopic(int id)
        {
            var query = new TopicByIdQuery
            {
                intIdTopic = id
            };

            var response = _mediator.Send(query);

            return Ok(response);
        }

        //Update one Topic
        [Route("{id:int}")]
        [Authorize]
        public IHttpActionResult PutTopic(int id, [FromBody]UpdateTopicCommand command)
        {
            command.intIdTopic = id;
            var resposta = _mediator.Send(command);
            return Ok(resposta);
        }
        
        //Delete a Topic 
        [Route("{id:int}")]
        [Authorize]
        public IHttpActionResult DeleteTopic(int id)
        {
            var command = new DeleteTopicCommand { intIdTopic = id };
            _mediator.Send(command);
            return Ok(command);
        }
    }
}
