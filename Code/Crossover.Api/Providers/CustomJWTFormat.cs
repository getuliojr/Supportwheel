using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Web;
using Thinktecture.IdentityModel.Tokens;

namespace Crossover.Api.Providers
{
    public class CustomJwtFormat : ISecureDataFormat<AuthenticationTicket>
    {
        private const string AudiencePropertyKey = "audience";
        private readonly string _issuer = string.Empty;

        public CustomJwtFormat(string issuer)
        {
            _issuer = issuer;
        }

        //Protection Layer with JWT - Responsible for generating the token
        public string Protect(AuthenticationTicket data)
        {
            if (data == null)
            {
                throw new ArgumentNullException("data");
            }

            //Como o servidor possui o papel de server Resources e também de Authorização, o AudienceId e AudienceSecret está fixo no código.
            string audienceId = ConfigurationManager.AppSettings["AudienceId"];
            string symmetricKeyAsBase64 = ConfigurationManager.AppSettings["AudienceSecret"];
            var keyByteArray = TextEncodings.Base64Url.Decode(symmetricKeyAsBase64);
            var signingKey = new HmacSigningCredentials(keyByteArray);
            var issued = data.Properties.IssuedUtc;
            var expires = data.Properties.ExpiresUtc;
            var token = new JwtSecurityToken(_issuer, audienceId, data.Identity.Claims, issued.Value.UtcDateTime, expires.Value.UtcDateTime, signingKey);
            var handler = new JwtSecurityTokenHandler();          
            var jwt = handler.WriteToken(token);

            return jwt;
        }
        
        //Not necessary
        public AuthenticationTicket Unprotect(string protectedText)
        {
            throw new NotImplementedException();
        }
    }
}