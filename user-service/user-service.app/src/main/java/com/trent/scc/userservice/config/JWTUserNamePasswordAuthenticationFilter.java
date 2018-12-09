package com.trent.scc.userservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trent.scc.userservice.security.SecurityConstants;
import com.trent.scc.userservice.api.model.UserData;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("WeakerAccess")
public class JWTUserNamePasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter implements AuthenticationFailureHandler {

	private static final Logger LOGGER = LoggerFactory.getLogger(JWTUserNamePasswordAuthenticationFilter.class);
	private AuthenticationManager authenticationManager;

	public JWTUserNamePasswordAuthenticationFilter(AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res)
			throws AuthenticationException {
		try {

			UserData user = new ObjectMapper().readValue(req.getInputStream(), UserData.class);
			LOGGER.info("Attempting authentication for {} ", user.getUsername());

			return authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							user.getUsername(),
							user.getPassword(),
							Collections.emptyList()));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest req,
											HttpServletResponse response,
											FilterChain chain,
											Authentication auth) throws IOException {

		String tokenMode = req.getHeader("TokenMode");

		long expirationTime = "test".equals(tokenMode) ? SecurityConstants.TEST_EXPIRATION_TIME : SecurityConstants.EXPIRATION_TIME;

		UserWithUUID user = (UserWithUUID) auth.getPrincipal();
		String username = user.getUsername();
		Map<String, Object> claims = new HashMap<>();

		claims.put("username", username);

		String uuid = user.getUuid();

		String token = Jwts.builder()
				.setSubject(uuid)
				.addClaims(claims)
				.setExpiration(new Date(System.currentTimeMillis() + expirationTime))
				.signWith(SignatureAlgorithm.HS512, SecurityConstants.SECRET)
				.compact();

		response.setContentType("application/json");
		JSONObject json = new JSONObject();
		try {
			json.put("token", token);
			json.put("uuid", uuid);
		} catch (JSONException e) {
			e.printStackTrace();
		}

		response.getWriter().write(json.toString());
	}

	@Override
	public void onAuthenticationFailure(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) {

	}
}
