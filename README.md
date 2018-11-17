# SCC_TimeTracker
Repository for the seminar task of group 4 of the lecture Service and Cloud Computing by Dr. Braun, TU Dresden     
[Link to the lecture](https://tu-dresden.de/ing/informatik/sya/professur-fuer-rechnernetze/studium/lehrveranstaltungen/lehrveranstaltungsdetails?ln=de&lv_id=49)


## Idea
The idea is to create a web service that is capable of tracking time for certain activities. A user can use this service to track the amount of time he invests per day / week / month on certain tasks.
He can create a task and whenever he starts to work / spend time on this track, all he needs to do is to select this task and press a button. The service stores the start of the activity. When the user is finished with his task, he presses another button, causing the service to store the instant the user stopped working on this specific task.

Finally, a user will be able to gather all the information stored and visualize it to get an idea of how he spent his time.

## Technology Stack
We will use Spring, Eureka, Zuul, docker and OpenAPI 3.0 to build our backend service.
Additionally, we are planning to create an Android Client application that allows for convenient usage of the service.

## Architecture
We are planning to compose three micro services that make up our application: a user service, that is responsible for signing up, signing in and signing out users, a time tracking service that only allows for authorized requests to be processed and an accumulator service that is capabale of processing queries.

We will use a Zuul API-Gateway to redirect requests from a client to the specific service instance that is needed.

## Cloud Service Provider
We are planning to use a droplet on DigitalOcean to host our service.

## Functions
API: (send data, send data2; expected data)   
* User
** CRM
*** register (username, password)
*** login (username, password; token)
*** logout
** Time tracking
*** start activity (token, timestamp, activity)
*** stop activity (token, timestamp, activity)
*** delete activity (token, activity)
*** edit tracked activity (token, edited record)
*** (registration new activity (token, activity))
** Personal statistic
*** get last activities (token; last records)
*** time series of the day / week / month / year / all (token; time series)
*** average of day / week / month / year / all (token; average)
*** for main activities may extra graphical representation
**** sleep: from 12 am to 12 am next day a diagram, bar chart of sleep
* Statistic of all users
** Only for the main activities
** For Everybody / Only User?
** Same options as for User
** All tracked hours / activities and so on

Main activities   
* sleep
* study / learn
* sport
* work

Additional expansions if we have enough time   
* Social component
** add friends
** compare tracked activities (overlaying graphics)
* may we generate the diagrams on the server and not in the client (token; graphic)

## Deadlines
| Datum          | Ziel                                                                                    |
|----------------|-----------------------------------------------------------------------------------------|
| 11.+18.12.2018 | Technologieauswahl, Web Service mit Test-Clients                                        |
| 28.01.2019     | Finale Abgabe                                                                           |
| 29.01.2019     | Gesamtergebnis mit Client-Applikationen und Sicherheits-Erweiterungen, Docker-Container |
