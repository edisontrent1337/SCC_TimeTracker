package com.trent.scc.timingservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TimingServiceApp {

	private static final Logger LOGGER = LoggerFactory.getLogger(TimingServiceApp.class);

	public static void main(String[] args) {
		SpringApplication.run(TimingServiceApp.class, args);
	}
}
