using System.Data.Entity;
using System.Reflection;
using Autofac;

namespace SupportWheel.DependencyResolver
{
    public class QueryModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assembly.Load("SupportWheel.Queries"))
            .AsImplementedInterfaces();

            builder.RegisterType(typeof(DatabaseContext))
            .As(typeof(DbContext))
            .InstancePerLifetimeScope();
        }
    }
}