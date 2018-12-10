package com.trent.scc.frontendservice.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// FIXME Can we remove this?
@Component
public class WebConfig implements WebMvcConfigurer {
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/").setViewName("forward:/dist/index.html");
		registry.addViewController("/single-spa.config.js").setViewName("forward:/dist/single-spa.config.js");
	}
}
