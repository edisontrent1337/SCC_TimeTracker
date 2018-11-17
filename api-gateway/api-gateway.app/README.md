# ILMA core API Gateway

## Idea
The API Gateway is capable of forwarding requests to responsible Smart Service
instances. All communication inside the ILMA core takes place via the
API Gateway.
It uses
[Zuul]("https://cloud.spring.io/spring-cloud-netflix/single/spring-cloud-netflix.html#_router_and_filter_zuul")
as a reverse proxy to achieve the desired functionality.
The gateway resides on port `8762`, so any requests to a Smart Service during
development should be issued towards `http://localhost:8762`.

## Details
The gateway automatically maps application / service names onto dedicated
path.
If not otherwise specified, in case of a Spring Boot Application, the value of
`spring.application.name` inside the `application.yml` file determines the
Smart Service name, the docker image name, and thus the name of the path to
the Smart Service.
Once the core is running, you can verify mapped routes by navigating to
`http://localhost:8762/actuator/routes`.
If an instance of your own Smart Service is up and running, you can verify
if the Service Registry picked it up and the API Gateway provides a mapping to
your service.
You should see an output similar to this:
``` json
{
    "/smart-service/**":"smart-service",
    "/user-service/**":"user-service",
    "/your-custom-service/**":"your-custom-service"
}
```
