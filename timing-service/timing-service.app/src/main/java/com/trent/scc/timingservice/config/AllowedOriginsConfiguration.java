package com.trent.scc.timingservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "configuration.cors")
public class AllowedOriginsConfiguration {

	private List<String> allowedOrigins;

	public AllowedOriginsConfiguration() {
		this.allowedOrigins = new ArrayList<>();
	}

	List<String> getAllowedOrigins() {
		return allowedOrigins;
	}

	public void setAllowedOrigins(List<String> allowedOrigins) {
		this.allowedOrigins = allowedOrigins;
	}
}
