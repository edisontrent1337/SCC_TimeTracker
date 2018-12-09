package com.trent.scc.userservice.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class UserWithUUID extends User {

	private final String uuid;

	public UserWithUUID(String username, String password, Collection<? extends GrantedAuthority> authorities, String uuid) {
		super(username, password, authorities);
		this.uuid = uuid;
	}

	String getUuid() {
		return uuid;
	}

}
