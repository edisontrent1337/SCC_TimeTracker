package com.trent.scc.userservice.config;

import io.jsonwebtoken.Jwts;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

import static com.trent.scc.userservice.jwt.JWTConstants.*;

public class JWTBasicAuthenticationFilter extends BasicAuthenticationFilter {

	public JWTBasicAuthenticationFilter(AuthenticationManager authenticationManager) {
		super(authenticationManager);
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request,
									HttpServletResponse response,
									FilterChain chain) throws IOException, ServletException {
		String token = request.getHeader(AUTHORIZATION);
		if (token != null && token.startsWith(BEARER_PREFIX)) {
			UsernamePasswordAuthenticationToken authentication = getAuthenticationForToken(token);
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}
		chain.doFilter(request, response);
	}

	private UsernamePasswordAuthenticationToken getAuthenticationForToken(String token) {
		String user = Jwts.parser()
				.setSigningKey(SECRET)
				.parseClaimsJws(token.replace(BEARER_PREFIX, ""))
				.getBody()
				.getSubject();
		if (user != null) {
			return new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
		}
		return null;
	}

}
