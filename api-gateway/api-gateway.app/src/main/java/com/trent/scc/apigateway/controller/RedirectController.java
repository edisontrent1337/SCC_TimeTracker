package com.trent.scc.apigateway.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class RedirectController {

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String index() {
		System.out.println("Redirect to /");
		return "forward:/ui/";
	}

	@RequestMapping(value = "/test")
	public String inPlaceTest() {
		System.out.println("Redirect to test");
		return "forward:/";
	}

	@RequestMapping(value = "/config")
	public String inPlaceConfig() {
		System.out.println("Redirect to config");
		return "forward:/";
	}

	@RequestMapping(value = "/progress")
	public String progressInPlace() {
		System.out.println("Redirect to progress");
		return "forward:/";
	}


	@RequestMapping(value = "/signup", method = RequestMethod.GET)
	public String signUp() {
		System.out.println("Redirect to signup");

		return "forward:/";
	}

	@RequestMapping(value = "/dashboard/{path:[^\\.]+}/**")
	public String dashboard() {
		return "forward:/";
	}

	@RequestMapping(value = "/dashboard")
	public String dashboardInPlace() {
		return "forward:/";
	}

	@RequestMapping(value = "/stats/{path:[^\\.]+}/**")
	public String stats() {
		return "forward:/";
	}

	@RequestMapping(value = "/stats")
	public String statsInPlace() {
		return "forward:/";
	}
}

