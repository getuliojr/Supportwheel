using AutoMapper;
using SupportWheel.Commands.CommentCommands.Command;
using SupportWheel.Commands.TopicCommands.Command;
using SupportWheel.Commands.UserCommands.Command;
using SupportWheel.Domain.Entities;

namespace SupportWheel.Api.AutoMapper
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