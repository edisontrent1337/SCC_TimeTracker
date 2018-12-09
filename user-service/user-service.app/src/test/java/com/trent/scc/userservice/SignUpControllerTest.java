package com.trent.scc.userservice;

import com.trent.scc.userservice.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class SignUpControllerTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TestRestTemplate restTemplate;

	@Before
	public void setUp() {
		userRepository.deleteAll();
		assertEquals("There were users left in the database.", 0, userRepository.count());
	}

	@Test
	public void testAuthenticationProcess() {
		signup("test_user");
		login("test_user");
	}

	private void signup(String username) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<String> entity = new HttpEntity<>("{\"username\": \""
				+ username
				+ "\", \"password\": \"test_password\"}",
				headers);

		System.out.println(entity.getBody());
		ResponseEntity<String> response = restTemplate.exchange("/signup",
				HttpMethod.POST,
				entity,
				String.class);

		assertEquals(HttpStatus.OK, response.getStatusCode());
	}

	private void login(String username) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<String> entity = new HttpEntity<>("{\"username\": \""
				+ username
				+ "\", \"password\": \"test_password\"}",
				headers);
		ResponseEntity<String> response = restTemplate.exchange("/login",
				HttpMethod.POST,
				entity,
				String.class);

		assertEquals(HttpStatus.OK, response.getStatusCode());
		String responseBody = response.getBody();
		assertNotNull(responseBody);
		assertTrue(responseBody.contains("token"));

	}
}