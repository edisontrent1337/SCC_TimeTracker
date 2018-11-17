package com.trent.scc.userservice.security;

public class SecurityConstants {
	public static final String SECRET = "SecretKeyToGenJWTs";
	public static final long EXPIRATION_TIME = 864_000_000L; // 10 days
	public static final long TEST_EXPIRATION_TIME = 31_536_000_000L; // 1 year
	public static final String TOKEN_PREFIX = "Bearer ";
	public static final String HEADER_STRING = "Authorization";
}