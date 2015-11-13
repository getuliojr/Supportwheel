using System.Data.Entity;
using System.Reflection;
using Autofac;

namespace Crossover.DependencyResolver
{
    public class CommandModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assembly.Load("Crossover.Commands"))
            .AsImplementedInterfaces();

            builder.RegisterType(typeof(CrossoverContext))
            .As(typeof(DbContext))
            .InstancePerLifetimeScope();
        }
    }
}