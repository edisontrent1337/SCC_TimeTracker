package com.trent.robolab.pythontest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PythonTestApp {

	private static final Logger LOGGER = LoggerFactory.getLogger(PythonTestApp.class);

	public static void main(String[] args) {
		SpringApplication.run(PythonTestApp.class, args);
	}
}
