package com.trent.robolab.pythontest.service;

import com.trent.robolab.pythontest.api.model.*;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface IPythonTestService extends UserDetailsService {

	OperationResult<TestResult> addTestResult(TestResult result);
	OperationResult<Participants> setParticipants(Participants participants);
	OperationResult<Participants> enterTest(Participants participants);
	OperationResult<CorrectAnswers> setCorrectAnswers(CorrectAnswers correctAnswers);
	OperationResult<TestResultSummary> getTestResults();
	OperationResult<TestResult> getTestResultForStudent(String matriculationNumber);

	OperationResult<String> concludeTest();

	OperationResult<String> resetTest();

	OperationResult<TestProgress> getTestProgress();
}
