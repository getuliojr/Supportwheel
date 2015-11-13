using AutoMapper;
using Crossover.Commands.CommentCommands.Command;
using Crossover.Commands.TopicCommands.Command;
using Crossover.Commands.UserCommands.Command;
using Crossover.Domain.Entities;

namespace Crossover.Api.AutoMapper
{
    public class CommandToDomainMappingProfile : Profile
    {
        public override string ProfileName
        {
            get { return "CommandToDomainMappings"; }
        }

        protected override void Configure()
        {

            //Comment
            Mapper.CreateMap<CreateCommentCommand, Comment>();
            Mapper.CreateMap<UpdateCommentCommand, Comment>();
            Mapper.CreateMap<DeleteCommentCommand, Comment>();

            //Topic
            Mapper.CreateMap<CreateTopicCommand, Topic>();
            Mapper.CreateMap<UpdateTopicCommand, Topic>();
            Mapper.CreateMap<DeleteTopicCommand, Topic>();

            //User
            Mapper.CreateMap<CreateUserCommand, User>();


        }
    }
}