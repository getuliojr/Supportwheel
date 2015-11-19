using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using Crossover.Domain;
using Crossover.Domain.Entities;
using System.Security.Claims;
using System.Net.Http;
using System.Web;
using System.Web.Routing;
using System.Threading;
using Crossover.DependencyResolver.Migrations;

namespace Crossover.DependencyResolver
{
    public class CrossoverContext : DbContext
    {
        public CrossoverContext()
            : base("CrossoverContext")
        {
           // Database.SetInitializer<CrossoverContext>(new CreateDatabaseIfNotExists<CrossoverContext>());
        }

        public static RequestContext GetRequestContext()
        {
            HttpContextBase context = new HttpContextWrapper(HttpContext.Current);
            return new RequestContext(context, RouteTable.Routes.GetRouteData(context));
        }

        //Mapeamento das tabelas
        public DbSet<User> User { get; set; }
        public DbSet<Topic> Topic { get; set; }
        public DbSet<Comment> Comment { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<CrossoverContext, Configuration>());

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
           // modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();

            modelBuilder.Properties()
                .Where(p => p.ReflectedType != null && p.Name ==  "intId" + p.ReflectedType.Name)
                .Configure(p => p.IsKey());

            modelBuilder.Properties<string>()
                .Configure(p => p.HasColumnType("varchar"));

            modelBuilder.Properties<string>()
                .Configure(p => p.HasMaxLength(100));

        }

        private Nullable<int> getCurrentUserId()
        {
            //Get Current User ID and set it on the Entity when user is authenticated 
            ClaimsPrincipal principal = Thread.CurrentPrincipal as ClaimsPrincipal;
            if (principal.Claims.Where(c => c.Type == "intIdUser").SingleOrDefault() != null)
            {
                return Convert.ToInt32(principal.Claims.Where(c => c.Type == "intIdUser").SingleOrDefault().Value);
            }

            return null;
        }

        public override int SaveChanges()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(entry => entry.Entity is AuditableEntity
                       && (entry.State == EntityState.Added || entry.State == EntityState.Modified));


            foreach (var entry in modifiedEntries)
            {
                var entity = entry.Entity as AuditableEntity;
                if (entity != null)
                {
                    DateTime now = DateTime.UtcNow;

                    if (entry.State == EntityState.Added)
                    {
                        entity.dteCreated = now;
                        var intIdUserCreated = getCurrentUserId();
                        if (intIdUserCreated != null)
                        {
                            entity.intIdUserCreated = Convert.ToInt32(intIdUserCreated);
                        }
                        
                    }
                    else
                    {
                        Entry(entity).Property(x => x.dteCreated).IsModified = false;
                        entity.dteModified = now;
                        entity.intIdUserModified = getCurrentUserId();
                    }

                }

            }

            return base.SaveChanges();


        }
    }
}
