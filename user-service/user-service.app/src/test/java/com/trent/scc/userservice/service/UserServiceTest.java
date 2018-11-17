package com.trent.scc.userservice.service;

import com.trent.scc.userservice.repository.UserRepository;
import com.trent.scc.userservice.api.model.RegistrationStatus;
import com.trent.scc.userservice.api.model.UserData;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserServiceTest {

	@Autowired
	private IUserService userService;

	@Autowired
	private UserRepository userRepository;

	@Before
	public void setUp() {
		userRepository.deleteAll();
	}

	@Test
	public void registerUserWorksCorrectly() {
		String userName = "userOne";
		UserData userData = new UserData().username(userName).password("myPassword");
		assertEquals("The user must be registered successfully.",
				RegistrationStatus.SUCCESS,
				userService.registerUser(userData));
		assertEquals("The number of registered users was wrong", 1, userRepository.count());

		String uuid = userRepository.findByName(userName).getUuid();
		assertNotNull("The uuid must be set.", uuid);

		assertEquals("The user must not be registered twice successfully.",
				RegistrationStatus.USERNAME_ALREADY_TAKEN,
				userService.registerUser(userData));

		userData.setUsername("userTwo");
		userData.setPassword("invalid");

		assertEquals("Invalid passwords should not be accepted by the user service.",
				RegistrationStatus.INVALID_PASSWORD,
				userService.registerUser(userData));
		assertEquals("The number of registered users was wrong", 1, userRepository.count());

		userData.setPassword("aValidPassword");
		userService.registerUser(userData);
		assertEquals("The number of registered users was wrong", 2, userRepository.count());

	}
}