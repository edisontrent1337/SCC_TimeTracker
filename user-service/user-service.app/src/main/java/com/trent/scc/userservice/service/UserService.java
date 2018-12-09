package com.trent.scc.userservice.service;

import java.util.*;

import com.trent.scc.userservice.api.model.RegistrationStatus;
import com.trent.scc.userservice.api.model.UserData;
import com.trent.scc.userservice.api.model.UuidData;
import com.trent.scc.userservice.config.UserWithUUID;
import com.trent.scc.userservice.repository.UserEntity;
import com.trent.scc.userservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

	@Autowired
	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public RegistrationStatus registerUser(UserData userData) {
		String name = userData.getUsername();
		String password = userData.getPassword();
		if (userRepository.findByName(name) != null) {
			return RegistrationStatus.USERNAME_ALREADY_TAKEN;
		}

		if (password.length() < 8 || password.length() > 63) {
			return RegistrationStatus.INVALID_PASSWORD;
		}

		UserEntity userEntity = new UserEntity();
		userEntity.setName(name);
		userEntity.setPassword(passwordEncoder.encode(password));
		userEntity.setRegistrationDate(new Date());
		userEntity.setUuid(UUID.randomUUID().toString());

		userRepository.save(userEntity);
		return RegistrationStatus.SUCCESS;
	}

	@Override
	public UserData getUserInfo(String userUuid) {
		UserEntity entity = userRepository.findByUuid(userUuid);
		UserData result = new UserData();
		if (entity != null) {
			result.setUsername(entity.getName());
			return result;
		}
		return null;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		LOGGER.info("Loading user with name: " + username);
		UserEntity userEntity = userRepository.findByName(username);

		if (userEntity == null) {
			LOGGER.info("The user entity for " + username + "was null");
			throw new UsernameNotFoundException("No user was found with the name: " + username);
		}


		return new UserWithUUID(userEntity.getName(),
				userEntity.getPassword(),
				Collections.singletonList(new SimpleGrantedAuthority("user")), userEntity.getUuid());
	}

	@Override
	public UuidData getUuidData(String username) {
		UserEntity entity = userRepository.findByName(username);
		if (entity == null) {
			LOGGER.info("The user entity for " + username + "was null");
			throw new UsernameNotFoundException("No user was found with the name: " + username);
		} else {
			UuidData data = new UuidData();
			data.addUuidsItem(entity.getUuid());
			return data;
		}
	}

	@Override
	public List<UserData> getUserInfoForUuids(List<String> uuidList) {
		List<UserData> result = new ArrayList<>();
		for (int i = 0; i < uuidList.size(); i += 2) {
			String uuid = uuidList.get(i);
			String role = uuidList.get(i + 1);
			UserData userData = getUserInfo(uuid);
			if (userData != null) {
				userData.setRole(role);
				result.add(userData);
			}
		}
		return result;
	}
}
