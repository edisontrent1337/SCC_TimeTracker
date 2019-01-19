package com.trent.scc.frontendservice;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;

import static org.junit.Assert.assertEquals;

public class FrontendServiceTest extends AbstractFrontendServiceTest {

	@Autowired
	private TestRestTemplate testRestTemplate;

	@Test
	public void getUiServices() {
		String url = "http://localhost:" + servicePort + "/uiservices";
		ResponseEntity<String> result = testRestTemplate.getForEntity(url, String.class);
		String body = result.getBody();
		assertEquals("{\"services\":[{\"serviceId\":\"service1\",\"serviceName\":\"ServiceName1\",\"serviceAddress\":\"/service1/dist/bundle.js\"}]}", body);
	}
}
