using System.Collections.Generic;
using System.Reflection;
using System.Web.Http;
using Autofac;
using CommonServiceLocator.AutofacAdapter.Unofficial;
using Autofac.Features.Variance;
using Autofac.Integration.WebApi;
using MediatR;
using SupportWheel.DependencyResolver;
using Owin;


namespace SupportWheel.Api
{
    public class AutofacConfig
    {
        public static void Register(HttpConfiguration config, IAppBuilder app)
        {
            //Build Constructon Instance
            var builder = new ContainerBuilder();

            builder.RegisterSource(new ContravariantRegistrationSource());
            builder.RegisterAssemblyTypes(typeof(IMediator).Assembly).AsImplementedInterfaces();

            // Register Web API controller in executing assembly.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());//.InstancePerRequest();


            // Necessary to configure the instances for MediatR 2.x forward
            builder.Register<SingleInstanceFactory>(ctx =>
            {
                var c = ctx.Resolve<IComponentContext>();
                return t => c.Resolve(t);
            });
            builder.Register<MultiInstanceFactory>(ctx =>
            {
                var c = ctx.Resolve<IComponentContext>();
                return t => (IEnumerable<object>)c.Resolve(typeof(IEnumerable<>).MakeGenericType(t));
            });
 
            //Register other layers
            builder.RegisterModule(new QueryModule());
            builder.RegisterModule(new CommandModule());
            
            builder.RegisterType<AutofacServiceLocator>().AsImplementedInterfaces();
            var container = builder.Build();

            //ServiceLocator.SetLocatorProvider(serviceLocatorProvider);            
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            // This should be the first middleware added to the IAppBuilder.
            app.UseAutofacMiddleware(container);

            // Make sure the Autofac lifetime scope is passed to Web API.
            app.UseAutofacWebApi(config);

        }
    }
}