package com.trent.scc.userservice.service;

import com.trent.scc.userservice.api.model.RegistrationStatus;
import com.trent.scc.userservice.api.model.UserData;
import com.trent.scc.userservice.api.model.UuidData;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface IUserService extends UserDetailsService {
	RegistrationStatus registerUser(UserData userData);
	UserData getUserInfo(String userUuid);
	UuidData getUuidData(String username);
	List<UserData> getUserInfoForUuids(List<String> uuidList);
}
