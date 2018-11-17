package com.trent.scc.userservice.controller;

import com.trent.scc.userservice.api.SignupApi;
import com.trent.scc.userservice.api.model.RegistrationStatus;
import com.trent.scc.userservice.api.model.UserData;
import com.trent.scc.userservice.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@SuppressWarnings("unused")
public class UserController implements SignupApi {

	private final UserService userService;

	private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@Override
	public ResponseEntity<RegistrationStatus> signup(@Valid @RequestBody UserData userData) {
		RegistrationStatus registrationStatus = userService.registerUser(userData);
		LOGGER.info("Registered user " + userData.getUsername() + " with result " + registrationStatus);
		return ResponseEntity.ok(registrationStatus);
	}
}
