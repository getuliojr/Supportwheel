using AutoMapper;
using Crossover.Domain.Entities;
using Crossover.Queries.CommentQueries.QueryResult;
using Crossover.Queries.TopicQueries.QueryResult;
using Crossover.Queries.UserQueries.QueryResult;

namespace Crossover.Api.AutoMapper
{
    public class DomainToQueryResultMappingProfile : Profile
    {
        public override string ProfileName
        {
            get { return "DomainToQueryResultMappings"; }
        }

        protected override void Configure()
        {

            //Comment
            Mapper.CreateMap<Comment, CommentResult>()
               .ForMember(dest => dest.strFullNameCreated, opt => opt.MapFrom(src => src.UserCreated.strFullName));

            //Topic
            Mapper.CreateMap<Topic, AllTopicsResult>()
                .ForMember(dest => dest.strFullNameCreated, opt => opt.MapFrom(src => src.UserCreated.strFullName))
                .ForMember(dest => dest.intQtyComments, opt => opt.MapFrom(src => src.Comments.Count));

            Mapper.CreateMap<Topic, TopicResult>()
               .ForMember(dest => dest.strFullNameCreated, opt => opt.MapFrom(src => src.UserCreated.strFullName));

            //User
            Mapper.CreateMap<User, LoginUserResult>();
            Mapper.CreateMap<User, CurrentUserResult>();


        }
    }
}