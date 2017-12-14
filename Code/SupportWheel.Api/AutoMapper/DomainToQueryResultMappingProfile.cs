using AutoMapper;
using SupportWheel.Domain.Entities;
using SupportWheel.Queries.EngineerQueries.QueryResult;
using SupportWheel.Queries.ScheduleQueries.QueryResult;
using SupportWheel.Queries.UserQueries.QueryResult;

namespace SupportWheel.Api.AutoMapper
{
    public class DomainToQueryResultMappingProfile : Profile
    {
        public override string ProfileName
        {
            get { return "DomainToQueryResultMappings"; }
        }

        protected override void Configure()
        {
            //Engineer
            Mapper.CreateMap<Engineer, EngineerResult>()
               .ForMember(dest => dest.strFullNameCreated, opt => opt.MapFrom(src => src.UserCreated.strFullName));

            //Schedule
            Mapper.CreateMap<Schedule, ScheduleResult>()
               .ForMember(dest => dest.strFullNameCreated, opt => opt.MapFrom(src => src.UserCreated.strFullName))
               .ForMember(dest => dest.strNameEngineer, opt => opt.MapFrom(src => src.Engineer.strNameEngineer));

            //User
            Mapper.CreateMap<User, LoginUserResult>();
            Mapper.CreateMap<User, CurrentUserResult>();


        }
    }
}