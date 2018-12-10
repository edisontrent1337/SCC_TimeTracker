package com.trent.scc.frontendservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class RedirectController {
	@RequestMapping(value = "/services/{path:[^\\.]+}")
	public String redirectToServiceOverview() {
		return "redirect:/services";
	}

	@RequestMapping(value = "/services")
	public String inPlace() {
		return "forward:/";
	}

	@RequestMapping(value = "/signup", method = RequestMethod.GET)
	public String signUp() {
		return "forward:/";
	}

	@RequestMapping(value = "/projects")
	public String projects() {
		return "forward:/";
	}

	@RequestMapping(value = "/project/{path:[^\\.]+}")
	public String project() {
		return "forward:/";
	}

}
