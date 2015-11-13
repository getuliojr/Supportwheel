using AutoMapper;
using Crossover.Api.AutoMapper;

namespace Crossover.Api
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