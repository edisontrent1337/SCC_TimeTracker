package com.trent.robolab.pythontest.service;

import com.trent.robolab.pythontest.api.model.CorrectAnswers;
import com.trent.robolab.pythontest.api.model.Participants;
import com.trent.robolab.pythontest.api.model.TestResult;
import com.trent.robolab.pythontest.api.model.TestResultSummary;
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
}
