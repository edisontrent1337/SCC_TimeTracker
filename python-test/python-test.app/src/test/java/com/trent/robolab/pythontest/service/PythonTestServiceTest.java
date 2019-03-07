package com.trent.robolab.pythontest.service;

import com.trent.robolab.pythontest.PythonTestApp;
import com.trent.robolab.pythontest.api.model.CorrectAnswers;
import com.trent.robolab.pythontest.api.model.Participants;
import com.trent.robolab.pythontest.api.model.TestResult;
import com.trent.robolab.pythontest.repository.TestResultEntity;
import com.trent.robolab.pythontest.repository.TestResultRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = PythonTestApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class PythonTestServiceTest {

	@Autowired
	private PythonTestService pythonTestService;

	@Autowired
	private TestResultRepository testResultRepository;


	@Before
	public void cleanUp() {
		testResultRepository.deleteAll();
	}


	@Test
	public void addParticipantsWorksCorrectly() {
		Participants participants = new Participants();
		participants.addMatriculationNumbersItem(3946479);
		OperationResult<Participants> result = pythonTestService.setParticipants(participants);
		assertEquals("The operation should be successful", OperationStatus.SUCCESS, result.getStatus());
		assertEquals("There should be one test result in the db", 1, testResultRepository.count());

		result = pythonTestService.setParticipants(participants);
		assertEquals("The operation should be successful", OperationStatus.SUCCESS, result.getStatus());
		assertEquals("Adding the same participants twice should be idempotent", 1, testResultRepository.count());

		participants.getMatriculationNumbers().clear();
		participants.addMatriculationNumbersItem(1234567);
		result = pythonTestService.setParticipants(participants);
		assertEquals("The operation should be successful", OperationStatus.SUCCESS, result.getStatus());
		assertEquals("There should be two test result in the db", 2, testResultRepository.count());
	}

	@Test
	public void addTestResultWorksCorrectly() {
		Participants participants = new Participants();
		int matriculationNumber = 3946479;
		participants.addMatriculationNumbersItem(matriculationNumber);
		pythonTestService.setParticipants(participants);

		TestResult testResult = new TestResult();
		testResult.setSelfEvaluation1("A");
		testResult.setSelfEvaluation2("B");

		testResult.setMatriculationNumber(matriculationNumber);
		testResult.setAnswers(Arrays.asList(0, 1, 2, 3, 2, 3, 2));

		OperationResult<TestResult> result = pythonTestService.addTestResult(testResult);
		assertEquals("The operation should be successful", OperationStatus.SUCCESS, result.getStatus());

		TestResultEntity entity = testResultRepository.findByMatriculationNumber(matriculationNumber);
		assertNotNull(entity);
		assertNotNull(entity.getAnswers());
		assertEquals("0,1,2,3,2,3,2", entity.getAnswers());
		assertEquals("A,B", entity.getSelfEvaluation());
	}

	@Test
	public void createCSVFromResultsWorksCorrectly() {
		addTestResult(1234567, "A", "B", 0, 1, 0, 2, -1, 0, 1);
		addTestResult(1234568, "B", "B", 1, 1, 0, 2, 1, 0, 1);
		CorrectAnswers correctAnswers = new CorrectAnswers();
		correctAnswers.setAnswers(Arrays.asList(0,1,0,2,1,0,1));
		pythonTestService.setCorrectAnswers(correctAnswers);
		assertEquals(2, testResultRepository.count());
		OperationResult<String> result = pythonTestService.getTestResults();
		assertEquals(OperationStatus.SUCCESS, result.getStatus());
		assertEquals("1234567,A,B,1,1,1,1,0,1,1\n" +
								"1234568,B,B,0,1,1,1,1,1,1", result.getPayload());
	}

	private void addTestResult(int matriculationNumber, String selfEvalA, String selfEvalB, int... answers) {
		Participants participants = new Participants();
		participants.addMatriculationNumbersItem(matriculationNumber);
		pythonTestService.setParticipants(participants);
		TestResult result = new TestResult();
		result.setMatriculationNumber(matriculationNumber);
		result.setSelfEvaluation1(selfEvalA);
		result.setSelfEvaluation2(selfEvalB);
		for (int answer : answers) {
			result.addAnswersItem(answer);
		}
		pythonTestService.addTestResult(result);

	}
}