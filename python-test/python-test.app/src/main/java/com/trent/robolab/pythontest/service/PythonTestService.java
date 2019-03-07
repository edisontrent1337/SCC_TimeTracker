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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;

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
	public OperationResult<TestResult> addTestResult(TestResult testResult) {
		OperationResult<TestResult> result = new OperationResult<>();
		Integer matriculationNumber = testResult.getMatriculationNumber();
		TestResultEntity entity = testResultRepository.findByMatriculationNumber(matriculationNumber);
		if (entity == null) {
			result.setStatus(OperationStatus.UNAUTHORIZED);
			LOGGER.error("The student with matriculation number " + testResult.getMatriculationNumber() + " was not found");
			return result;
		} else {
			StringBuilder builder = new StringBuilder();
			List<Integer> answers = testResult.getAnswers();
			CorrectAnswersEntity correctAnswersEntity = correctAnswersRepository.findAll().iterator().next();
			String[] correctAnswers = correctAnswersEntity.getAnswers().split(",");
			for (int i = 0; i < answers.size(); i++) {
				Integer answer = answers.get(i);
				String givenAnswer = Integer.toString(answer);
				builder.append(givenAnswer.equals(correctAnswers[i]) ? 1 : 0);
				if (i != answers.size() - 1) {
					builder.append(",");
				}
			}
			entity.setAnswers(builder.toString());
			entity.setSelfEvaluation(testResult.getSelfEvaluation1() + "," + testResult.getSelfEvaluation2());
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
		StringBuilder builder = new StringBuilder();
		List<Integer> answers = correctAnswers.getAnswers();

		for (int i = 0, answersSize = answers.size(); i < answersSize; i++) {
			Integer answer = answers.get(i);
			builder.append(Integer.toString(answer));
			if (i != answersSize - 1) {
				builder.append(",");
			}
		}
		if (correctAnswersRepository.count() == 0) {
			CorrectAnswersEntity entity = new CorrectAnswersEntity();
			entity.setAnswers(builder.toString());
			entity.setCreationDate(OffsetDateTime.now());
			correctAnswersRepository.save(entity);
		} else {
			CorrectAnswersEntity entity = correctAnswersRepository.findAll().iterator().next();
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
		for (Iterator<TestResultEntity> iterator = results.iterator(); iterator.hasNext(); ) {
			TestResultEntity resultEntity = iterator.next();
			if ("".equals(resultEntity.getAnswers()) || "".equals(resultEntity.getSelfEvaluation())) {
				LOGGER.info("The student " + resultEntity.getMatriculationNumber() + " has not answered.");
				continue;
			}
			LOGGER.info("The answer given was " + resultEntity.getAnswers());
			String[] givenAnswers = resultEntity.getAnswers().split(",");
			builder
					.append(resultEntity.getMatriculationNumber())
					.append(",");
			String[] selfEval = resultEntity.getSelfEvaluation().split(",");
			builder.append(selfEval[0])
					.append(",")
					.append(selfEval[1])
					.append(",");
			builder.append(resultEntity.getAnswers());
			builder.append(",");
			float numberOfCorrectAnswers = 0;
			for (String answer : givenAnswers) {
				numberOfCorrectAnswers += answer.equals("1") ? 1 : 0;
			}

			float score = numberOfCorrectAnswers / givenAnswers.length;
			score = (float) (Math.round(score * 10000.0) / 10000.0) * 100;
			builder.append(Float.toString(score));
			if (iterator.hasNext()) {
				builder.append("\n");
			}
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

	@Override
	public OperationResult<TestResult> getTestResultForStudent(String matriculationNumber) {
		OperationResult<TestResult> operationResult = new OperationResult<>();
		TestResultEntity resultEntity = testResultRepository.findByMatriculationNumber(Integer.parseInt(matriculationNumber));
		if (resultEntity == null || "".equals(resultEntity.getAnswers()) || "".equals(resultEntity.getSelfEvaluation())) {
			operationResult.setStatus(OperationStatus.NOT_EXISTING);
			operationResult.setPayload(null);
		} else {
			TestResult testResult = new TestResult();
			testResult.setMatriculationNumber(resultEntity.getMatriculationNumber());
			String[] selfEval = resultEntity.getSelfEvaluation().split(",");
			testResult.setSelfEvaluation1(selfEval[0]);
			testResult.setSelfEvaluation2(selfEval[1]);
			List<String> answerStrings = Arrays.asList(resultEntity.getAnswers().split(","));
			List<Integer> answersAsNumber = new ArrayList<>();
			answerStrings.forEach((answer) -> {
				answersAsNumber.add(Integer.parseInt(answer));
			});
			testResult.setAnswers(answersAsNumber);
			operationResult.setPayload(testResult);
			operationResult.setStatus(OperationStatus.SUCCESS);
		}
		return operationResult;
	}

	@Override
	public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
		return null;
	}
}
