using System;
using System.Data.Entity;
using MediatR;
using AutoMapper;
using SupportWheel.Domain.Entities;
using SupportWheel.Utils.Security;
using SupportWheel.Commands.ScheduleCommands.Command;
using System.Linq;
using System.Configuration;
using System.Collections.Generic;

namespace SupportWheel.Commands.ScheduleCommands.CommandHandler
{
    public class CreateScheduleCommandHandler : IRequestHandler<CreateScheduleCommand, Schedule>
    {
        private readonly DbContext _dbContext;

        public CreateScheduleCommandHandler(DbContext context)
        {
            _dbContext = context;
        }

        public Schedule Handle(CreateScheduleCommand command)
        {
            var entity = Mapper.Map<Schedule>(command);
            var blnTrytoSave = true;
            var validEngineersList = ReturnValidEngineersListForDraft(command);
            var randomEngineer = DraftEngineer(validEngineersList);

            //Add id of engineer to entity
            entity.intIdEngineer = randomEngineer.intIdEngineer;

            //Keeping try a draft for at least 20 times
            while (blnTrytoSave)
            {
                try
                {
                    _dbContext.Set<Schedule>().Add(entity);
                    _dbContext.SaveChanges();
                    blnTrytoSave = false;

                }
                catch (Exception ex)
                {
                    if (ex.InnerException.InnerException.Message.Contains("Unique_Period"))
                    {
                        command = nextValidPeriod(command);
                        validEngineersList = ReturnValidEngineersListForDraft(command);
                        randomEngineer = DraftEngineer(validEngineersList);

                        //At this point try to save the information in the database, if it returns an error, this specific draft has already been done
                        //by someone else and a new period or day should be selected and restarted
                        entity.intIdEngineer = randomEngineer.intIdEngineer;
                        entity.dteSchedule = command.dteSchedule;
                        entity.intPeriod = command.intPeriod;
                    }
                    else
                    {
                        blnTrytoSave = false;
                    }
                }
            }

            //Return final result of the draft
            return entity;
        }


        private Engineer DraftEngineer(List<Engineer> validEngineersList)
        {
            //From this point we have a valid enginnersList of engineers that have worked the same amount or one shift less from all the others for a ramdom draft
            Random rnd = new Random();
            return validEngineersList[rnd.Next(validEngineersList.Count)];
        }

        //Return a valid list of enginners for a draft based on the parameters of the command
        private List<Engineer> ReturnValidEngineersListForDraft(CreateScheduleCommand command)
        {
            //Find out when this week draft starts
            var currentWeekMonday = command.dteSchedule.AddDays(DayOfWeek.Monday - command.dteSchedule.DayOfWeek > 0 ? (DayOfWeek.Monday - command.dteSchedule.DayOfWeek) - 7 : DayOfWeek.Monday - command.dteSchedule.DayOfWeek).Date;

            //Get first day of the last week to validate business rule of 2 weeks period
            var beforeWeekMonday = currentWeekMonday.AddDays(-7);


            //Get Ids of engineers that have shifts from the beggining of the last week to the date of the draft
            var lastShiftsEngineersID = _dbContext
                            .Set<Schedule>().Where(s => s.dteSchedule <= command.dteSchedule)
                            .Where(s => s.dteSchedule >= beforeWeekMonday)
                            .Select(s => s.intIdEngineer).ToList();

            //Get the ids of the enginners that have worked on the day before this draft
            var beforeDate = command.dteSchedule.DayOfWeek == DayOfWeek.Monday ? command.dteSchedule.AddDays(-3) : command.dteSchedule.AddDays(-1);
            var lastDayShiftsEngineersID = _dbContext
                            .Set<Schedule>().Where(s => s.dteSchedule == beforeDate)
                            .Select(s => s.intIdEngineer).ToList();

            //Get all enginnersList from the Database
            var allEngineersList = _dbContext.Set<Engineer>().ToList();

            //Create a list of valid engineers for the draft
            var validEngineersList = new System.Collections.Generic.List<Engineer>();
            var currentNumberShiftsPerEngineer = 0;
            while (validEngineersList.Count() == 0)
            {
                var notValidListEnginnersID = from item in lastShiftsEngineersID
                                              group item by item into g
                                              where g.Count() >= currentNumberShiftsPerEngineer + 1
                                              select g.Key;

                //List of engineers that have worked one shift less than the others and not worked in the day before
                validEngineersList = allEngineersList
                                        .Where(t => !notValidListEnginnersID.Contains(t.intIdEngineer) && !lastDayShiftsEngineersID.Contains(t.intIdEngineer)).ToList();
                //Add one to the count of shifts filtered
                currentNumberShiftsPerEngineer++;
            }

            //Return a valid list of engineers for a draft
            return validEngineersList;

        }

        //Get a next valid period to be draft. This function is used when the last one had already been done by another person
        private CreateScheduleCommand nextValidPeriod(CreateScheduleCommand command)
        {
            int shiftsPerPeriod = Convert.ToInt32(ConfigurationManager.AppSettings["shiftsPerPeriod"]);
            if (command.intPeriod < shiftsPerPeriod)
            {
                //Add one to shift period to try a new draft in the same day
                command.intPeriod = command.intPeriod + 1;
            }
            else
            {
                //Get the next available date to draft
                if (command.dteSchedule.DayOfWeek == DayOfWeek.Friday)
                {
                    //Next Monday
                    command.dteSchedule = command.dteSchedule.AddDays(3);
                }
                else
                {
                    //Next Day
                    command.dteSchedule = command.dteSchedule.AddDays(1);
                }

                command.intPeriod = 1;
                
            }

            //Return new valid command to try to execute
            return command;
        }
    }
}
