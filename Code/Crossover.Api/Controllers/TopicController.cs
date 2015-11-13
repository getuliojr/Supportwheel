using System.Web.Http;
using MediatR;
using Crossover.Commands.TopicCommands.Command;
using Crossover.Queries.TopicQueries.Query;

namespace Crossover.Api.Controllers
{

    [RoutePrefix("api/topic")]
    [Authorize]
    public class TopicController : ApiController
    {

        private readonly IMediator _mediator;
        public TopicController(IMediator mediator)
        {
            _mediator = mediator;
        }

        //Create New Topic
        [Route("")]
        public IHttpActionResult PostTopic([FromBody]CreateTopicCommand command)
        {
            var resposta = _mediator.Send(command);

            return Ok(resposta);
        }

        //Get All Topics
        [Route("")]
        public IHttpActionResult GetTopics()
        {
            var query = new AllTopicsQuery();
            
            var response = _mediator.Send(query);

            return Ok(response);
        }


        //Get one Topic by ID
        [Route("{id:int}")]
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
        public IHttpActionResult PutTopic(int id, [FromBody]UpdateTopicCommand command)
        {
            command.intIdTopic = id;
            var resposta = _mediator.Send(command);

            return Ok("Updated Successfully!");
        }
        
        //Delete a Topic 
        [Route("{id:int}")]
        public IHttpActionResult DeleteTopic(int id)
        {

            _mediator.Send(new DeleteTopicCommand { intIdTopic = id });

            return Ok("Deleted Successfuly");
        }
    }
}
