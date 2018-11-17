# ILMA Service Registry

## Idea
The ILMA Service Registry is the place where all Smart Services are registered.
It uses the [Spring Cloud Netflix Stack](https://cloud.spring.io/spring-cloud-netflix/)
to implement the desired functionality.
Any Smart Service has to register itself at the Service Registry and can use it
to find instances of another desired service.

## Security
The Service Registry is secured via HTTP Basic Authentication.
Have a look at
```java
@Bean
public InMemoryUserDetailsManager inMemoryUserDetailsManager() {
    InMemoryUserDetailsManager inMemoryUserDetailsManager = new InMemoryUserDetailsManager();
    User admin = new User("admin",
            passwordEncoder.encode("password"),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
    inMemoryUserDetailsManager.createUser(admin);
    User serviceProvider = new User("ilma-smart-service",
            passwordEncoder.encode("password"),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_SERVICE_PROVIDER")));
    inMemoryUserDetailsManager.createUser(serviceProvider);
    return inMemoryUserDetailsManager;
}
```
During development, the core uses in memory authentication to secure the admin
page and end points that allow service registration. Use the credentials above
during development to authenticate your Smart Service.

## Verify running Smart Service Instances
Navigate to `http://localhost:8761` and authenticate with user `admin` and
password `password`.
You will now see an overview of all running Smart Services.
Here, you will also be able to see your own Smart Services
during development and integration testing.
![Architecture](../documentation/spring_eureka_overview.png)

## Gather information about existing Smart Services
Under `http://localhost:8761/eureka/apps`, you can find all sorts of meta information
on the currently running Smart Services:
``` xml
<applications>
    <versions__delta>1</versions__delta>
    <apps__hashcode>UP_3_</apps__hashcode>
    <application>
        <name>API-GATEWAY</name>
        <instance>
            <instanceId>2ffa15c58e58:api-gateway:8762</instanceId>
            <hostName>172.18.0.4</hostName>
            <app>API-GATEWAY</app>
            <ipAddr>172.18.0.4</ipAddr>
            <status>UP</status>
            <overriddenstatus>UNKNOWN</overriddenstatus>
            <port enabled="true">8762</port>
            <securePort enabled="false">443</securePort>
            <countryId>1</countryId>
            <dataCenterInfo class="com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo">
                <name>MyOwn</name>
            </dataCenterInfo>
            <leaseInfo>
                <renewalIntervalInSecs>30</renewalIntervalInSecs>
                <durationInSecs>90</durationInSecs>
                <registrationTimestamp>1536841921270</registrationTimestamp>
                <lastRenewalTimestamp>1536842700615</lastRenewalTimestamp>
                <evictionTimestamp>0</evictionTimestamp>
                <serviceUpTimestamp>1536841921271</serviceUpTimestamp>
            </leaseInfo>
            <metadata>
                <management.port>8762</management.port>
            </metadata>
            <homePageUrl>http://172.18.0.4:8762/</homePageUrl>
            <statusPageUrl>http://172.18.0.4:8762/actuator/info</statusPageUrl>
            <healthCheckUrl>http://172.18.0.4:8762/actuator/health</healthCheckUrl>
            <vipAddress>api-gateway</vipAddress>
            <secureVipAddress>api-gateway</secureVipAddress>
            <isCoordinatingDiscoveryServer>false</isCoordinatingDiscoveryServer>
            <lastUpdatedTimestamp>1536841921271</lastUpdatedTimestamp>
            <lastDirtyTimestamp>1536841920470</lastDirtyTimestamp>
            <actionType>ADDED</actionType>
        </instance>
    </application>
    <application>
        <name>SMART-SERVICE</name>
        <instance>
            <instanceId>e544349d13c3:smart-service:9000</instanceId>
            <hostName>172.18.0.6</hostName>
            <app>SMART-SERVICE</app>
            <ipAddr>172.18.0.6</ipAddr>
            <status>UP</status>
            <overriddenstatus>UNKNOWN</overriddenstatus>
            <port enabled="true">9000</port>
            <securePort enabled="false">443</securePort>
            <countryId>1</countryId>
            <dataCenterInfo class="com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo">
                <name>MyOwn</name>
            </dataCenterInfo>
            <leaseInfo>
                <renewalIntervalInSecs>30</renewalIntervalInSecs>
                <durationInSecs>90</durationInSecs>
                <registrationTimestamp>1536841923754</registrationTimestamp>
                <lastRenewalTimestamp>1536842703530</lastRenewalTimestamp>
                <evictionTimestamp>0</evictionTimestamp>
                <serviceUpTimestamp>1536841923754</serviceUpTimestamp>
            </leaseInfo>
            <metadata>
                <management.port>9000</management.port>
            </metadata>
            <homePageUrl>http://172.18.0.6:9000/</homePageUrl>
            <statusPageUrl>http://172.18.0.6:9000/actuator/info</statusPageUrl>
            <healthCheckUrl>http://172.18.0.6:9000/actuator/health</healthCheckUrl>
            <vipAddress>smart-service</vipAddress>
            <secureVipAddress>smart-service</secureVipAddress>
            <isCoordinatingDiscoveryServer>false</isCoordinatingDiscoveryServer>
            <lastUpdatedTimestamp>1536841923754</lastUpdatedTimestamp>
            <lastDirtyTimestamp>1536841923329</lastDirtyTimestamp>
            <actionType>ADDED</actionType>
        </instance>
    </application>
    <application>
        <name>USER-SERVICE</name>
        <instance>
            <instanceId>fedcf97b085d:user-service:8080</instanceId>
            <hostName>172.18.0.5</hostName>
            <app>USER-SERVICE</app>
            <ipAddr>172.18.0.5</ipAddr>
            <status>UP</status>
            <overriddenstatus>UNKNOWN</overriddenstatus>
            <port enabled="true">8080</port>
            <securePort enabled="false">443</securePort>
            <countryId>1</countryId>
            <dataCenterInfo class="com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo">
                <name>MyOwn</name>
            </dataCenterInfo>
            <leaseInfo>
                <renewalIntervalInSecs>30</renewalIntervalInSecs>
                <durationInSecs>90</durationInSecs>
                <registrationTimestamp>1536841928178</registrationTimestamp>
                <lastRenewalTimestamp>1536842708282</lastRenewalTimestamp>
                <evictionTimestamp>0</evictionTimestamp>
                <serviceUpTimestamp>1536841928178</serviceUpTimestamp>
            </leaseInfo>
            <metadata>
                <management.port>8080</management.port>
            </metadata>
            <homePageUrl>http://172.18.0.5:8080/</homePageUrl>
            <statusPageUrl>http://172.18.0.5:8080/actuator/info</statusPageUrl>
            <healthCheckUrl>http://172.18.0.5:8080/actuator/health</healthCheckUrl>
            <vipAddress>user-service</vipAddress>
            <secureVipAddress>user-service</secureVipAddress>
            <isCoordinatingDiscoveryServer>false</isCoordinatingDiscoveryServer>
            <lastUpdatedTimestamp>1536841928178</lastUpdatedTimestamp>
            <lastDirtyTimestamp>1536841928049</lastDirtyTimestamp>
            <actionType>ADDED</actionType>
        </instance>
    </application>
</applications>
```
