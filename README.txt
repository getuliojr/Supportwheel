Information about the Project:

1. There are a lot of .NET dependencies, node depencies and bower dependecies, so in order for the code to run it is required to build e download all dependencies first. If Visual Studio is been used it probably will download all dependencies before running. 

The Visual Studio used was 2015 Express and the Backend Architecture used was based on a CQS Pattern (Command Query Separation). The objetive is that is can be easily scalable, where one all queries would be served by many servers, the insert (command) for a vertical server. This model was tested in this project since it is small and a very nice example of backend to demonstrate. The Frontend would be on a complete separate server also.

Becasuse of that, to open this application at least two IIS Express instances have to be up (Crossover.Api) and (Crossover.Frontend). The Api will run on port 9000 and the Frontend is running on port 10000. So be sure both instances are up and running.

This architecture brought a level of complexy because it requires CORS and it is configured right for the WebApi, but I failed to make it work for SignalR (real-time application), most because of my time-limit. I couldn´t afford to work for 2 days in this project and it pay it the price when I had to deal with it for the first time. If time were extended I could complete it.

To install front-end dependencies it is required to run NPM INSTALL and then BOWER INSTALL and it will take care of the rest. To run the tests with code coverage example type GRUNT test:unit

2. To open the project just select the option Start Multiple Projects and select .Api and .Frontend to be started.

3. Karma running is installed so just run grunt test:unit and it will run all the tests. I´ve setup unit test examples for most relevant part of the application. Since this project is for avaliation and not production the focus was to show the skills and not have 100% code coverage. The project has nos 52% of code coverage.

4. SignalR failed to run with CORS, OWIN and WebApi. Probably a configuration in the Startup that I still haven´t figured out. There is code in the examples but it was not integrated because of that. I will try to have it done at the presentation. 

Signalr will be responsible to send the application core appResourceFactory updates about the resource and surrogatekey to any client listening. It will be receiving instant feedback. 

Unfortunaly I did not got enought time to figure why it is giving problem with CORS