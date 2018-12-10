package com.trent.scc.frontendservice;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = FrontendServiceApplication.class, webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
public abstract class AbstractFrontendServiceTest {

	private static final Integer EUREKA_SERVER_PORT = 8761;

	private static ConfigurableApplicationContext eurekaServer;

	private static ConfigurableApplicationContext application1;

	private static ConfigurableApplicationContext application2;

	@BeforeClass
	public static void startEureka() throws InterruptedException {
		eurekaServer = SpringApplication.run(EurekaServer.class,
				"--server.port=" + EUREKA_SERVER_PORT,
				"--eureka.instance.leaseRenewalIntervalInSeconds=1");

		// registration has to take place...
		Thread.sleep(3000);

		application1 = SpringApplication.run(TestApplication.class,
				"--server.port=0",
				"--spring.application.name=Service1",
				"--spring.jmx.default-domain=Service1",
				"--eureka.client.serviceUrl.defaultZone=http://localhost:" + EUREKA_SERVER_PORT + "/eureka",
				"--eureka.instance.metadata-map.hasUi=true",
				"--eureka.instance.metadata-map.serviceName=ServiceName1");

		application2 = SpringApplication.run(TestApplication.class,
				"--server.port=0",
				"--spring.application.name=Service2",
				"--spring.jmx.default-domain=Service2",
				"--eureka.client.serviceUrl.defaultZone=http://localhost:" + EUREKA_SERVER_PORT + "/eureka",
				"--eureka.instance.metadata-map.hasUi=false");

		// registration has to take place...
		Thread.sleep(3000);
	}

	@AfterClass
	public static void closeEureka() {
		application2.close();
		application1.close();
		eurekaServer.close();
	}

	@LocalServerPort
	protected int servicePort;

	@Configuration
	@EnableAutoConfiguration(exclude = { SecurityAutoConfiguration.class})
	@EnableEurekaServer
	static class EurekaServer {
	}

	@Configuration
	@SpringBootApplication(exclude = { SecurityAutoConfiguration.class})
	@EnableEurekaClient
	static class TestApplication {
	}
}
