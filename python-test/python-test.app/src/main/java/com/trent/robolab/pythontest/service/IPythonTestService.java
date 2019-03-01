package com.trent.robolab.pythontest.service;

import com.trent.robolab.pythontest.api.model.CorrectAnswers;
import com.trent.robolab.pythontest.api.model.Participants;
import com.trent.robolab.pythontest.api.model.TestResult;

public interface IPythonTestService {

	OperationResult<TestResult> createTestResult(TestResult result);
	OperationResult<Participants> setParticipants(Participants participants);
	OperationResult<CorrectAnswers> setCorrectAnswers(CorrectAnswers correctAnswers);
	OperationResult<String> getTestResults();

}
