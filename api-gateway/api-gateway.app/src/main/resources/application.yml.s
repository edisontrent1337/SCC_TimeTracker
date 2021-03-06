spring:
  application:
    name: api-gateway

server:
  port: 8762
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: password
    key-store-type: PKCS12
    key-alias: tomcat

eureka:
  instance:
    preferIpAddress: true
  client:
    registerWithEureka: true
    fetchRegistry: true
    serviceUrl:
      defaultZone: ${EUREKA_URI:http://scc-service:password@localhost:8761/eureka}

management:
  endpoints:
    web:
      exposure:
        include: "*"

zuul:
  sensitiveHeaders: Cookie,Set-Cookie
  routes:
    ui:
      path: /ui/**
      serviceId: frontend-service
      stripPrefix: true      

ribbon:
  ReadTimeout: 3000
  ConnectTimeout: 3000
  IsSecure: true

hystrix:
  command:
    default:
      execution:
        timeout:
          enabled: false
