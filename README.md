# SCC_TimeTracker
Repository for the seminar task of group 4 of the lecture Service and Cloud Computing by Dr. Braun, TU Dresden 
Link: https://tu-dresden.de/ing/informatik/sya/professur-fuer-rechnernetze/studium/lehrveranstaltungen/lehrveranstaltungsdetails?ln=de&lv_id=49


## Idea
The idea is to create a web service that is capable of tracking time for certain activities. A user can use this service to track the amount of time he invests per day / week / month on certain tasks.
He can create a task and whenever he starts to work / spend time on this track, all he needs to do is to select this task and press a button. The service stores the start of the activity. When the user is finished with his task, he presses another button, causing the service to store the instant the user stopped working on this specific task.

Finally, a user will be able to gather all the information stored and visualize it to get an idea of how he spent his time.

## Technology Stack
We will use Spring, Eureka, Zuul, docker and OpenAPI 3.0 to build our backend service.
