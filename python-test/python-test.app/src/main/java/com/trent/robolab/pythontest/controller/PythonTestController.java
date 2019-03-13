package com.trent.robolab.pythontest.controller;

import com.trent.robolab.pythontest.api.PytestApi;
import com.trent.robolab.pythontest.api.model.*;
import com.trent.robolab.pythontest.service.OperationResult;
import com.trent.robolab.pythontest.service.PythonTestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class PythonTestController implements PytestApi {

	private static final Logger LOGGER = LoggerFactory.getLogger(PythonTestController.class);

	private final PythonTestService pythonTestService;

	@Override
	public ResponseEntity<String> resetTest() {
		OperationResult<String> result = pythonTestService.resetTest();
		return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<OperationResponse> getTestResultForStudent(@PathVariable String matriculationNumber) {
		OperationResult<TestResult> result = pythonTestService.getTestResultForStudent(matriculationNumber);
		OperationResponse response = new OperationResponse();
		switch (result.getStatus()) {
			case SUCCESS:
				response.addDataItem(result.getPayload());
				break;
			case NOT_EXISTING:
				String info = "Info: " + matriculationNumber + " has not submitted any result yet.";
				LOGGER.info(info);
				response.error(info);
				return new ResponseEntity<>(response, HttpStatus.OK);
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Autowired
	public PythonTestController(PythonTestService pythonTestService) {
		this.pythonTestService = pythonTestService;
	}


	@Override
	public ResponseEntity<OperationResponse> createTestResult(@Valid @RequestBody TestResult testResult) {
		OperationResponse response = new OperationResponse();
		OperationResult<TestResult> result = pythonTestService.addTestResult(testResult);
		switch (result.getStatus()) {
			case SUCCESS:
				response.addDataItem(testResult);
				break;
			case DUPLICATE_FAILURE:
				response.error("Error: You have already answered the test.");
				break;
			case NOT_EXISTING:
				response.error("No correct answer string was set in the config.");
				break;
			case FAILURE:
				response.error("The set answer string in the configuration is malformed.");
				break;
			case UNAUTHORIZED:
				response.error("Error: You are not authorized to submit a test result.");
				break;
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<OperationResponse> getAllTestResults() {
		OperationResult<TestResultSummary> result = pythonTestService.getTestResults();
		OperationResponse response = new OperationResponse();
		response.addDataItem(result.getPayload());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<OperationResponse> updateTestResult(@Valid @RequestBody TestResult testResult) {
		return null;
	}

	@Override
	public ResponseEntity<OperationResponse> setCorrectAnswers(@Valid @RequestBody CorrectAnswers correctAnswers) {
		OperationResult<CorrectAnswers> result = pythonTestService.setCorrectAnswers(correctAnswers);
		OperationResponse response = new OperationResponse();
		switch (result.getStatus()) {
			case SUCCESS:
				response.addDataItem(result.getPayload());
				break;
			case NOT_EXISTING:
				break;
			case FAILURE:
				String error = "Error while setting correct answers.";
				response.setError(error);
				LOGGER.error(error);
				break;
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
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

	@Override
	public ResponseEntity<String> concludeTest() {
		OperationResult<String> result = pythonTestService.concludeTest();
		return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
	}


	@Override
	public ResponseEntity<OperationResponse> getTestProgress() {
		OperationResult<TestProgress> result = pythonTestService.getTestProgress();
		OperationResponse response = new OperationResponse();
		response.addDataItem(result.getPayload());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
