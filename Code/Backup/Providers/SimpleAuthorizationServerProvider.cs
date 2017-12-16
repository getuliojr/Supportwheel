using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System.Collections.Generic;
using SupportWheel.Queries.UserQueries.Query;
using Autofac.Integration.Owin;
using Autofac;
using MediatR;
using Microsoft.Owin;

namespace SupportWheel.Api.Providers
{
    public class SimpleAuthorizationServerProvider: OAuthAuthorizationServerProvider
    {


        //Aqui deve ser incluída a lógica para validar o client, porém como só teremos um cliente (AngularJS Frontend)
        //não se faz necessário implementar essa lógica, desta forma apenas validamos para fazer tudo em um passo só (Single OAuth 2.0 Flow)
        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
            return Task.FromResult<object>(null); 
        }

        //Called when a request to the Token endpoint arrives with a "grant_type" of "password". 
        //This occurs when the user has provided name and password credentials directly into the client application's user interface, 
        //and the client application is using those to acquire an "access_token" and optional "refresh_token".
        public override Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {

            //Injeta o mediator
            var mediator = context.OwinContext
                                    .GetAutofacLifetimeScope()
                                    .Resolve<IMediator>();

            //Get USER
            var LoginUserQuery = new LoginUserQuery
            {
                strEmail = context.UserName,
                strPassword = context.Password
            };
            var user = mediator.Send(LoginUserQuery);

            if (user == null)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                context.Response.Headers.Add("AuthorizationResponse", new[] { "Failed" });
                return Task.FromResult<object>(null); 
            }
            else
            {

                var identity = new ClaimsIdentity("JWT");
                identity.AddClaim(new Claim("intIdUser", user.intIdUser.ToString())); //Id do Usuário
                identity.AddClaim(new Claim(ClaimTypes.Name, user.strFullName));
                identity.AddClaim(new Claim("sub", user.strEmail)); //UserName
                identity.AddClaim(new Claim(ClaimTypes.Role, "User"));

                var props = new AuthenticationProperties(new Dictionary<string, string>
                {
                    {
                         "audience", (context.ClientId == null) ? string.Empty : context.ClientId
                    }
                });

                var ticket = new AuthenticationTicket(identity,props);
                context.Validated(ticket);
                return Task.FromResult<object>(null);
            }
 
        }
    }

    
}