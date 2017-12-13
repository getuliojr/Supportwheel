using System.Data.Entity;
using System.Linq;
using AutoMapper.QueryableExtensions;
using MediatR;
using SupportWheel.Domain.Entities;
using SupportWheel.Queries.ScheduleQueries.Query;
using SupportWheel.Queries.ScheduleQueries.QueryResult;
using System.Collections.Generic;
using System;

namespace SupportWheel.Queries.ScheduleQueries.QueryHandler
{
    public class SchedulesQueryHandler
    : IRequestHandler<SchedulesQuery, IEnumerable<ScheduleResult>>
    {

        private readonly DbContext _dbContext;

        public SchedulesQueryHandler(DbContext context)
        {
           _dbContext = context;
        }


        public IEnumerable<ScheduleResult> Handle(SchedulesQuery query)
        {
            var searchQuery = _dbContext
                               .Set<Schedule>().AsQueryable();

            var totalRecords = searchQuery.Count();

            searchQuery = searchQuery.OrderByDescending(s => s.dteSchedule)
                                     .ThenBy(s => s.intPeriod);
            

            //Paginate data if required
            if (query.intPageSize != null && query.intPageNumber != null)
            {
                searchQuery = searchQuery
                        .Skip(Convert.ToInt32(query.intPageSize) * (Convert.ToInt32(query.intPageNumber) - 1))
                        .Take(Convert.ToInt32(query.intPageSize));

            }

            //Get Result
            var response = searchQuery
                                .Project().To<ScheduleResult>().ToList();


            //Return total number of records available.
            foreach (var item in response)
            {
                item.intTotalRecords = totalRecords;
            }

            return response;


        }
    }
}