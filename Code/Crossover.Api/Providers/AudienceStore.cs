using Crossover.Domain.Entities;
using Microsoft.Owin.Security.DataHandler.Encoder;
using System;
using System.Security.Cryptography;


namespace Crossover.Api.Providers
{
    public class AudienceStore
    {
        public static Audience GenerateAudience(string name)
        {
            var clientId = Guid.NewGuid().ToString("N");

            var key = new byte[32];
            RNGCryptoServiceProvider.Create().GetBytes(key);
            var base64Secret = TextEncodings.Base64Url.Encode(key);

            Audience newAudience = new Audience {
                
                ClientId = clientId,
                Base64Secret = base64Secret,
                Name = name
            };

            return newAudience;
        }
    }
}