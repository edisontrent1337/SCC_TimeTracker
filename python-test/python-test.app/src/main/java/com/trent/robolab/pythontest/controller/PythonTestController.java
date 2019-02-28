package com.trent.robolab.pythontest.controller;

import com.trent.robolab.pythontest.service.PythonTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PythonTestController{

	private final PythonTestService pythonTestService;

	@Autowired
	public PythonTestController(PythonTestService pythonTestService) {
		this.pythonTestService = pythonTestService;
	}
}
