using System;
using System.Web.Http;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Crossover.Api.Providers;
using Owin;
using System.Configuration;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security;
using MediatR;

namespace Crossover.Api
{
    public class OauthConfig
    {

        public static void Register(HttpConfiguration config, IAppBuilder app)
        {
            //Client Information for OAUTH
            var issuer = ConfigurationManager.AppSettings["JwtIssuer"];
            var audienceId = ConfigurationManager.AppSettings["AudienceId"];
            var audienceSecret = TextEncodings.Base64Url.Decode(ConfigurationManager.AppSettings["AudienceSecret"]);
            
            //Configure where the user will get the token
            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                
                AllowInsecureHttp = Convert.ToBoolean(ConfigurationManager.AppSettings["AllowInsecureHttp"]), //Em produção aqui deve ser false
                TokenEndpointPath = new PathString("/api/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new SimpleAuthorizationServerProvider(),
                AccessTokenFormat = new CustomJwtFormat(issuer)
            };
            
            //Send 401 Error instead of 400 when user or password is wrong
            app.Use<InvalidAuthenticationMiddleware>();

            //// Api controllers with an [Authorize] attribute will be validated with JWT
            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    AuthenticationMode = AuthenticationMode.Active,
                    AllowedAudiences = new[] { audienceId },
                    IssuerSecurityTokenProviders = new IIssuerSecurityTokenProvider[]
                    {
                        new SymmetricKeyIssuerSecurityTokenProvider(issuer, audienceSecret)
                    }
                }
            );

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

        }
    }
}