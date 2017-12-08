using System.Data.Entity;
using System.Reflection;
using Autofac;

namespace SupportWheel.DependencyResolver
{
    public class CommandModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assembly.Load("SupportWheel.Commands"))
            .AsImplementedInterfaces();

            builder.RegisterType(typeof(DatabaseContext))
            .As(typeof(DbContext))
            .InstancePerLifetimeScope();
        }
    }
}