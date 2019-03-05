package com.trent.robolab.pythontest.controller;

import com.trent.robolab.pythontest.api.PytestApi;
import com.trent.robolab.pythontest.api.model.CorrectAnswers;
import com.trent.robolab.pythontest.api.model.OperationResponse;
import com.trent.robolab.pythontest.api.model.Participants;
import com.trent.robolab.pythontest.api.model.TestResult;
import com.trent.robolab.pythontest.service.OperationResult;
import com.trent.robolab.pythontest.service.PythonTestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class PythonTestController implements PytestApi {

	private static final Logger LOGGER = LoggerFactory.getLogger(PythonTestController.class);

	private final PythonTestService pythonTestService;

	@Autowired
	public PythonTestController(PythonTestService pythonTestService) {
		this.pythonTestService = pythonTestService;
	}


	@Override
	public ResponseEntity<OperationResponse> createTestResult(@Valid @RequestBody TestResult testResult) {
		OperationResponse response = new OperationResponse();
		OperationResult<TestResult> result = pythonTestService.createTestResult(testResult);
		switch (result.getStatus()) {
			case SUCCESS:
				response.addDataItem(testResult);
				break;
			case FAILURE:
				response.error("Error: An unspecified error occurred!");
				break;
			case UNAUTHORIZED:
				response.error("Error: You are not authorized to submit a test result");
				break;
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<String> getAllTestResults() {
		OperationResult<String> result = pythonTestService.getTestResults();
		return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<OperationResponse> updateTestResult(@Valid @RequestBody TestResult testResult) {
		return null;
	}

	@Override
	public ResponseEntity<OperationResponse> setCorrectAnswers(@Valid @RequestBody CorrectAnswers correctAnswers) {
		OperationResult<CorrectAnswers> result = pythonTestService.setCorrectAnswers(correctAnswers);
		switch (result.getStatus()){
			case SUCCESS:
				break;
			case NOT_EXISTING:
				break;
			case FAILURE:
				break;
		}
		return null;
	}

	@Override
	public ResponseEntity<OperationResponse> setParticipants(@Valid @RequestBody Participants participants) {
		OperationResult<Participants> result = pythonTestService.setParticipants(participants);
		OperationResponse response = new OperationResponse();
		switch (result.getStatus()) {
			case SUCCESS:
				response.addDataItem(participants);
				String info = "Successfully added " + participants.getMatriculationNumbers().size() + " matriculation numbers.";
				response.addDataItem(info);
				LOGGER.info(info);
				break;
			case FAILURE:
				String errorMessage = "Error: The list contains invalid matriculation numbers (shorter or longer than 7 digits";
				response.error(errorMessage);
				LOGGER.error(errorMessage);
				response.addDataItem(result.getPayload());
				break;
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<OperationResponse> enterTest(@Valid @RequestBody Participants participants) {
		OperationResult<Participants> result = pythonTestService.enterTest(participants);
		OperationResponse response = new OperationResponse();
		switch (result.getStatus()) {
			case SUCCESS:
				response.addDataItem(participants);
				break;
			case FAILURE:
				String error = "You did not provide correct data to enter the test.";
				response.error(error);
				LOGGER.error(error);
				return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
			case UNAUTHORIZED:
				error = "The matriculation number " + participants.getMatriculationNumbers().get(0) + " is not " +
						"authorized to participate. Maybe a typo? Please try again or talk to the organizers.";
				response.error(error);
				LOGGER.error(error);
				return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
