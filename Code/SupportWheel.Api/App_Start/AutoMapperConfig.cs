using AutoMapper;
using SupportWheel.Api.AutoMapper;

namespace SupportWheel.Api
{
    public class AutoMapperConfig
    {
        public static void RegisterMappings()
        {
            Mapper.Initialize(x =>
            {
                x.AddProfile<DomainToQueryResultMappingProfile>();
                x.AddProfile<CommandToDomainMappingProfile>();
                
            });
        }
    }
}