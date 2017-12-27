## Support Wheel of Fate - BAU

The objetive of this project was to fullfill a position with Richmond Group for a .NET Senior Architecture Development. To test my knowledge the following taks has been assigned:


### Summary

Design and build the “Support Wheel of Fate”

### Background


At one of our companies, all engineers take it in turns to support the business for half a day at a
time. This is affectionately known as BAU.
Currently, there is no tool which decides who is doing BAU and when, all rotas are created and
maintained by hand.

### Task

Your task is to design and build an online “Support Wheel of Fate”.
This should select two engineers at random to both complete a half day of support each. For the
purposes of this task you are free to assume that we have 10 engineers.

### Business Rules

There are some rules and these are liable to change in the future:
- An engineer can do at most one half day shift in a day.
- An engineer cannot have half day shifts on consecutive days.
- Each engineer should have completed one whole day of support in any 2 week period.

### Deliverables

At the end of the task, the following must be included:
- A Presentation Layer (Front End)
- An API


It is also important that you document your decisions as you will be expected to talk through your
approach.

### Rules

The rules are as follows:
1. There is no time limit
2. You are free to use the internet for research, inspiration and help
3. The solution should built using C#.


## DESIGN AND ARCHITECTURE


    The backend is build using .NET with (web.api 2, Owin, SignalR) it is based on the pattern CQRS (Command and Query Responsability Separation) where all the commands would be hosted on a server with a SQL database, while all queries could be stored in a separed server with another database, a denormazed one.

    Front-end is build using Angular.JS 1.6.x with components. All frontend is documented using ng-docs and docco. Tests are done with Jamine and Karma.

    OATH 2 has been implemented with JWT tokens for securiting the application in backend and frontend.

    Angular Material has been used for the layout desing.

### ONLINE DEMO

http://supportwheel.apphb.com/



### YOUTUBE PRESENTATION

https://www.youtube.com/watch?v=nXpjkXewb0s

