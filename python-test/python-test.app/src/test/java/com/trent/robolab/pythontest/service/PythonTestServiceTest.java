package com.trent.robolab.pythontest.service;

import com.trent.robolab.pythontest.PythonTestApp;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = PythonTestApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class PythonTestServiceTest {

	@Autowired
	private PythonTestService pythonTestService;

	@Before
	public void cleanUp() {
	}

}