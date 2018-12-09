package com.trent.scc.userservice.controller;

import com.trent.scc.userservice.api.UsersApi;
import com.trent.scc.userservice.api.model.UserData;
import com.trent.scc.userservice.api.model.UuidData;
import com.trent.scc.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
public class UserController implements UsersApi {

	private final UserService userService;

	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@Override
	public ResponseEntity<UserData> getUserName(@PathVariable("uuid") String uuid) {
		UserData userData = userService.getUserInfo(uuid);
		return ResponseEntity.ok(userData);
	}

	@Override
	public ResponseEntity<List<UserData>> getUserNamesFromUuidList(@Valid @RequestBody UuidData uuidData) {
		List<String> uuidList = uuidData.getUuids();
		List<UserData> result = userService.getUserInfoForUuids(uuidList);
		return ResponseEntity.ok(result);
	}

	@Override
	public ResponseEntity<UuidData> getUserUuid(@PathVariable("name") String name) {
		UuidData data = userService.getUuidData(name);
		return ResponseEntity.ok(data);
	}
}
