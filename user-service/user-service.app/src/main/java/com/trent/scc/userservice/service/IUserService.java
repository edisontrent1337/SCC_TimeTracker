package com.trent.scc.userservice.service;



import com.trent.scc.userservice.api.model.RegistrationStatus;
import com.trent.scc.userservice.api.model.UserData;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface IUserService extends UserDetailsService {
	RegistrationStatus registerUser(UserData userData);
}
