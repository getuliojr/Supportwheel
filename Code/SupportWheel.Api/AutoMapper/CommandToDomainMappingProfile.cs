using AutoMapper;
using SupportWheel.Commands.UserCommands.Command;
using SupportWheel.Commands.ScheduleCommands.Command;
using SupportWheel.Commands.EngineerCommands.Command;
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

            //Engineer
            Mapper.CreateMap<CreateEngineerCommand, Engineer>();
            Mapper.CreateMap<UpdateEngineerCommand, Engineer>();
            Mapper.CreateMap<DeleteEngineerCommand, Engineer>();

            //Schedule
            Mapper.CreateMap<CreateScheduleCommand, Schedule>();
            Mapper.CreateMap<DeleteScheduleCommand, Schedule>();

            //User
            Mapper.CreateMap<CreateUserCommand, User>();


        }
    }
}