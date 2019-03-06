package com.trent.robolab.pythontest.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// FIXME Can we remove this?
@Component
public class WebConfig implements WebMvcConfigurer {
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/").setViewName("forward:/dist/index.html");
		registry.addViewController("/bundle.js").setViewName("forward:/dist/bundle.js");
	}
}
