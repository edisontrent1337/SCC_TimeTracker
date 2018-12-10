# ILMA Frontend-Service

## Idea
The ILMA Frontend-Service is the place where different micro front ends are
composed and combined into a single page application.
The front ends of different smart services will be combined into a single view
that the user then can interact with.

The Frontend-Service consists of two parts: 

**The frontend part**: 
- is a React JS application
- resides in the maven module `frontend-service.ui`
- provides UI framework for composition of Service UIs

**The backend part**:
- Sprint Boot application with Swagger API
- resides in `frontend-service.api` and `frontend-service.app`
- serves the frontend as static resource
- provides an API for the frontend part to find all Smart Services with an UI

## Build

Run

	mvn clean install

in the base directory to build all modules and create a Docker container.

## Running the Frontend-Service

### Development

Start the `FrontendServiceApplication` in your IDE to start the backend part. Run `npm install` and then `npm start` in 
the directory `frontend-service.ui` to start the frontend part in development mode.

### Production

Run

	docker run -it frontend-service

to start the Docker container with all modules.

Refer to the top-level README in `ilma-core` for how to start this service with all of `ilma-core`.
