# ILMA User Service
The User Service is responsible for the registration of new users as well as the
Authorization of said users.

## Project Structure
The project consists of a *back end application* inside `user-service/user-service.app`,
a *front-end application* inside `user-service/user-service.ui` and an *API project* inside `user-service/user-service.api`.

### Back end Application
The back end application is a simple Spring Boot container that implements some endpoints that deal with registration
and authorization of a user.
As of now, it exposes therefore two endpoints: `/signup` and `/login`.

#### Sign Up
The sign up end point is used to sign up a new user to the ILMA platform.

#### Log in
The log in end point verifies credentials and issues a JWT on success.

### Front end Application
The front end is a React application that consumes both endpoints described previously.
It can be used to issue requests against the back end.


## Installation
If you want to install this component separately from the rest of the core, you
can do so by typing
``` sh
mvn clean install
```
in the root folder.
This will download all needed dependencies, install the back end application,
the API project and the React front end.
After installation, inspect your docker images with
``` sh
docker image ls
```
You should see an image called `user-service`.
## Running the back end
The back end application can be run by typing
``` sh
docker run user-service
```
Alternatively, if you wish to launch the stand alone jar, just type
```
java -jar user-service.app/target/user-service.app-0.0.1-SNAPSHOT.jar
```

## Running the front end
If the back end is up and running, you can start the front end application.
Navigate into `user-service.ui` and type
``` sh
npm start
```
This will start a webpack development server serving the front end.
