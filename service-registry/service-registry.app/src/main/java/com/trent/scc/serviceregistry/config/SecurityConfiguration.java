package com.trent.scc.serviceregistry.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@Order(1)
@SuppressWarnings({"unused", "WeakerAccess"})
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	private final PasswordEncoder passwordEncoder;

	@Autowired
	public SecurityConfiguration(PasswordEncoder passwordEncoder) {
		this.passwordEncoder = passwordEncoder;
	}

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(inMemoryUserDetailsManager());
	}

	@Bean
	public InMemoryUserDetailsManager inMemoryUserDetailsManager() {
		InMemoryUserDetailsManager inMemoryUserDetailsManager = new InMemoryUserDetailsManager();
		User admin = new User("admin",
				passwordEncoder.encode("password"),
				Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
		inMemoryUserDetailsManager.createUser(admin);
		User serviceProvider = new User("scc-service",
				passwordEncoder.encode("password"),
				Collections.singletonList(new SimpleGrantedAuthority("ROLE_SERVICE_PROVIDER")));
		inMemoryUserDetailsManager.createUser(serviceProvider);
		return inMemoryUserDetailsManager;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
				.authorizeRequests().antMatchers(HttpMethod.GET, "/").hasRole("ADMIN")
				.and()
				.authorizeRequests().antMatchers("/eureka/**").hasAnyRole("ADMIN", "SERVICE_PROVIDER")
				.anyRequest().denyAll()
				.and()
				.httpBasic()
				.and()
				.csrf().disable();
	}

}
