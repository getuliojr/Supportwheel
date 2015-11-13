using System.Data.Entity;
using System.Reflection;
using Autofac;

namespace Crossover.DependencyResolver
{
    public class QueryModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assembly.Load("Crossover.Queries"))
            .AsImplementedInterfaces();

            builder.RegisterType(typeof(CrossoverContext))
            .As(typeof(DbContext))
            .InstancePerLifetimeScope();
        }
    }
}