package com.trent.robolab.pythontest.service;


import com.trent.robolab.pythontest.api.model.CorrectAnswers;
import com.trent.robolab.pythontest.api.model.Participants;
import com.trent.robolab.pythontest.api.model.TestResult;
import com.trent.robolab.pythontest.repository.CorrectAnswersEntity;
import com.trent.robolab.pythontest.repository.CorrectAnswersRepository;
import com.trent.robolab.pythontest.repository.TestResultEntity;
import com.trent.robolab.pythontest.repository.TestResultRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PythonTestService implements IPythonTestService {

	private final TestResultRepository testResultRepository;
	private final CorrectAnswersRepository correctAnswersRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(PythonTestService.class);

	@Autowired
	public PythonTestService(TestResultRepository testResultRepository, CorrectAnswersRepository correctAnswersRepository) {
		this.testResultRepository = testResultRepository;
		this.correctAnswersRepository = correctAnswersRepository;
	}

	@Override
	public OperationResult<TestResult> createTestResult(TestResult testResult) {
		OperationResult<TestResult> result = new OperationResult<>();
		Integer matriculationNumber = testResult.getMatriculationNumber();
		TestResultEntity entity = testResultRepository.findByMatriculationNumber(matriculationNumber);
		if (entity == null) {
			result.setStatus(OperationStatus.UNAUTHORIZED);
			LOGGER.error("The student with matriculation number " + testResult.getMatriculationNumber() + " was not found");
			return result;
		} else {
			StringBuilder builder = new StringBuilder();
			for (Integer answer : testResult.getAnswers()) {
				builder.append(Integer.toString(answer));
			}
			entity.setAnswers(builder.toString());
			entity.setSelfEvaluation(testResult.getSelfEvaluation1() + testResult.getSelfEvaluation2());
			testResultRepository.save(entity);
			LOGGER.info("Successfully saved result for matriculation number " + testResult.getMatriculationNumber());
			result.setStatus(OperationStatus.SUCCESS);
		}
		return result;
	}

	@Override
	public OperationResult<Participants> setParticipants(Participants participants) {
		OperationResult<Participants> operationResult = new OperationResult<>();
		List<Integer> matriculationNumbers = participants.getMatriculationNumbers();

		List<Integer> invalidMatriculationNumbers = new ArrayList<>();
		for (int matriculationNumber : matriculationNumbers) {
			if (matriculationNumber > 9999999 || matriculationNumber < 1000000) {
				invalidMatriculationNumbers.add(matriculationNumber);
			}
		}

		if (invalidMatriculationNumbers.size() > 0) {
			operationResult.setStatus(OperationStatus.FAILURE);
			Participants invalidParticipants = new Participants();
			invalidParticipants.setMatriculationNumbers(invalidMatriculationNumbers);
			operationResult.setPayload(invalidParticipants);
			return operationResult;
		}

		for (Integer matriculationNumber : matriculationNumbers) {
			if (matriculationNumber > 9999999 || matriculationNumber < 1000000) {
				operationResult.setStatus(OperationStatus.FAILURE);
			}
			if (testResultRepository.findByMatriculationNumber(matriculationNumber) != null) {
				continue;
			}
			TestResultEntity testResultEntity = new TestResultEntity();
			testResultEntity.setMatriculationNumber(matriculationNumber);
			testResultEntity.setCreationDate(OffsetDateTime.now());
			testResultEntity.setUuid(UUID.randomUUID().toString());
			testResultEntity.setAnswers("");
			testResultEntity.setSelfEvaluation("");
			testResultRepository.save(testResultEntity);
		}
		operationResult.setStatus(OperationStatus.SUCCESS);
		return operationResult;
	}

	@Override
	public OperationResult<CorrectAnswers> setCorrectAnswers(CorrectAnswers correctAnswers) {
		CorrectAnswersEntity correctAnswersEntity = correctAnswersRepository.findById(1);
		StringBuilder builder = new StringBuilder();
		for (Integer answer : correctAnswers.getAnswers()) {
			builder.append(Integer.toString(answer));
		}
		if (correctAnswersEntity != null) {
			correctAnswersEntity.setAnswers(builder.toString());
			correctAnswersRepository.save(correctAnswersEntity);
		} else {
			CorrectAnswersEntity entity = new CorrectAnswersEntity();
			entity.setAnswers(builder.toString());
			entity.setCreationDate(OffsetDateTime.now());
			correctAnswersRepository.save(entity);
		}
		OperationResult<CorrectAnswers> result = new OperationResult<>();
		result.setStatus(OperationStatus.SUCCESS);
		return result;
	}

	@Override
	public OperationResult<String> getTestResults() {
		List<TestResultEntity> results = (List<TestResultEntity>) testResultRepository.findAll();
		StringBuilder builder = new StringBuilder();
		for (TestResultEntity resultEntity : results) {
			String[] givenAnswers = resultEntity.getAnswers().split("(?!^)");
			String[] correctAnswers = correctAnswersRepository.findById(1).getAnswers().split("(?!^)");
			builder
					.append(resultEntity.getMatriculationNumber())
					.append(",");
			builder.append(resultEntity.getSelfEvaluation().split("")[0]);
			builder.append(",");
			builder.append(resultEntity.getSelfEvaluation().split("")[1]);
			builder.append(",");
			for (int i = 0; i < givenAnswers.length; i++) {
				String answer = givenAnswers[i];
				String correctAnswer = correctAnswers[i];
				builder.append(answer.equals(correctAnswer) ? 1 : 0);
				if (i != givenAnswers.length - 1) {
					builder.append(",");
				}
			}

			builder.append("\n");
		}
		OperationResult<String> result = new OperationResult<>();
		result.setStatus(OperationStatus.SUCCESS);
		result.setPayload(builder.toString());
		return result;
	}

	@Override
	public OperationResult<Participants> enterTest(Participants participants) {
		OperationResult<Participants> result = new OperationResult<>();
		List<Integer> matriculationNumbers = participants.getMatriculationNumbers();
		result.setPayload(participants);
		if (matriculationNumbers.size() != 1) {
			result.setStatus(OperationStatus.FAILURE);
			return result;
		} else {
			int matriculationNumber = matriculationNumbers.get(0);
			TestResultEntity resultEntity = testResultRepository.findByMatriculationNumber(matriculationNumber);

			if (resultEntity == null) {
				result.setStatus(OperationStatus.UNAUTHORIZED);
				return result;
			}
		}
		result.setStatus(OperationStatus.SUCCESS);
		return result;
	}
}
