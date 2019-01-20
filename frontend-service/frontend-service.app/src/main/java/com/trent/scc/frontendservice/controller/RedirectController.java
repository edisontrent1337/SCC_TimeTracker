package com.trent.scc.frontendservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class RedirectController {

	@RequestMapping(value = "/activities/{path:[^\\.]+}")
	public String redirectToServiceOverview() {
		return "redirect:/activities";
	}

	@RequestMapping(value = "/activities")
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
}
