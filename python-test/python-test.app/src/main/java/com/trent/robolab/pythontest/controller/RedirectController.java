package com.trent.robolab.pythontest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class RedirectController {

	@RequestMapping(value = "/{path:[^\\.]+}")
	public String inPlace() {
		return "forward:/";
	}

	@RequestMapping(value = "/signup", method = RequestMethod.GET)
	public String signUp() {
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
