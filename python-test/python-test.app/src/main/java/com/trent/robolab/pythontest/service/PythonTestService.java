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
			if (!entity.getAnswers().isEmpty() && entity.getMatriculationNumber() != 1234567) {
				result.setStatus(OperationStatus.FAILURE);
				LOGGER.error("The student with matriculation number " + testResult.getMatriculationNumber() + " has already answered");
				return result;
			}
			StringBuilder builder = new StringBuilder();
			List<Integer> answers = testResult.getAnswers();
			CorrectAnswersEntity correctAnswersEntity = correctAnswersRepository.findFirstBy();
			if (correctAnswersEntity == null) {
				LOGGER.error("No correct answer string was set.");
			}
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
			float score = calculateScore(answers, testResult.getSelfEvaluation1(), testResult.getSelfEvaluation2());
			entity.setScore(score);
			testResultRepository.save(entity);
			LOGGER.info("Successfully saved result for matriculation number " + testResult.getMatriculationNumber());
			result.setStatus(OperationStatus.SUCCESS);
		}
		return result;
	}

	private float calculateScore(List<Integer> answers, String selfEvaluationA, String selfEvaluationB) {
		int numberOfCorrectAnswers = calculateNumberOfCorrectAnswers(answers);
		int gaußScore = calculateGaußScore(answers);
		float performance = gaußScore / (float) calcMaxScore(answers.size());
		String selfEval = "CBA";
		int evalScale = 1;
		int evalScoreA = 1 + selfEval.indexOf(selfEvaluationA) * evalScale;
		int evalScoreB = 1 + selfEval.indexOf(selfEvaluationB) * evalScale;
		float evalScore = evalScoreA + evalScoreB;
		int maxEvalScore = 2 * ((selfEval.length() - 1) * evalScale) + 2;
		float selfConfidence = Math.min(1, (evalScore / maxEvalScore) + 0.4f);
		float achievedScore = evalScore * performance + gaußScore * selfConfidence;
		float maxScore = calcMaxScore(answers.size());
		float score = Math.min(1, achievedScore / maxScore);
		score = (float) (Math.round(score * 10000.0) / 10000.0);
		return score * 100;
	}

	private int calcMaxScore(int numberOfAnswers) {
		int maxScore = 0;
		for (int i = 1; i <= numberOfAnswers; i++) {
			maxScore += Math.floorDiv(i, 2) + 1;
		}
		return maxScore;
	}

	private int calculateNumberOfCorrectAnswers(List<Integer> answers) {
		CorrectAnswersEntity correctAnswersEntity = correctAnswersRepository.findFirstBy();
		if (correctAnswersEntity == null) {
			LOGGER.error("No correct answer string was set.");
		}
		String[] correctAnswers = correctAnswersEntity.getAnswers().split(",");
		int numberOfCorrectAnswers = 0;
		for (int i = 0; i < answers.size(); i++) {
			String answer = Integer.toString(answers.get(i));
			numberOfCorrectAnswers += answer.equals(correctAnswers[i]) ? 1 : 0;
		}
		return numberOfCorrectAnswers;
	}

	private int calculateGaußScore(List<Integer> answers) {
		CorrectAnswersEntity correctAnswersEntity = correctAnswersRepository.findFirstBy();
		if (correctAnswersEntity == null) {
			LOGGER.error("No correct answer string was set.");
		}
		String[] correctAnswers = correctAnswersEntity.getAnswers().split(",");
		int numberOfCorrectAnswers = 0;
		for (int i = 0; i < answers.size(); i++) {
			String answer = Integer.toString(answers.get(i));
			numberOfCorrectAnswers += answer.equals(correctAnswers[i]) ? Math.floorDiv(i + 1, 2) + 1 : 0;
		}
		return numberOfCorrectAnswers;
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
			testResultEntity.setScore(0);
			testResultRepository.save(testResultEntity);

			TestResult result = new TestResult();
			result.setMatriculationNumber(matriculationNumber);
			result.setAnswers(generateRandomAnswer());
			result.setSelfEvaluation1(generateRandomSelfEvaluation());
			result.setSelfEvaluation2(generateRandomSelfEvaluation());
			addTestResult(result);
		}
		operationResult.setStatus(OperationStatus.SUCCESS);
		return operationResult;
	}

	private String generateRandomSelfEvaluation() {
		String selfEval = "ABC";
		Random random = new Random();
		return String.valueOf(selfEval.charAt(random.nextInt(3)));
	}

	private List<Integer> generateRandomAnswer() {
		CorrectAnswersEntity correctAnswersEntity = correctAnswersRepository.findFirstBy();
		int answersRequired = correctAnswersEntity.getAnswers().length();
		List<Integer> answer = new ArrayList<>();
		Random random = new Random();
		for (int i = 0; i < answersRequired; i += 2) {
			answer.add(random.nextInt(3));
		}
		return answer;
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
			CorrectAnswersEntity entity = correctAnswersRepository.findFirstBy();
			if (entity == null) {
				LOGGER.error("No correct answer string was set.");
			}
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
		results.sort((testResultEntity, otherEntity) -> Float.compare(testResultEntity.getScore(), otherEntity.getScore()));
		int chunkSize = Math.floorDiv(results.size(), 6);

		int numberOfGroupsOfFour = results.size() % 6;

		List<TestResultEntity> worst = new ArrayList<>();
		List<TestResultEntity> best = new ArrayList<>();
		List<TestResultEntity> upperMidRange = new ArrayList<>();
		List<TestResultEntity> lowerMidRange = new ArrayList<>();

		for (int i = numberOfGroupsOfFour; i < chunkSize + numberOfGroupsOfFour; i++) {
			worst.add(results.get(i));
			best.add(results.get(results.size() - 1 - i));
		}

		for (int i = chunkSize + numberOfGroupsOfFour; i < 3 * chunkSize + numberOfGroupsOfFour; i++) {
			lowerMidRange.add(results.get(i));
		}

		for (int i = 3 * chunkSize + numberOfGroupsOfFour; i < 5 * chunkSize + numberOfGroupsOfFour; i++) {
			upperMidRange.add(results.get(i));
		}

		StringBuilder builder = new StringBuilder();
		addSubList(builder, worst);
		builder.append("\n");
		addSubList(builder, lowerMidRange);
		builder.append("\n");
		addSubList(builder, upperMidRange);
		builder.append("\n");
		addSubList(builder, best);
		builder.append("\n");

		OperationResult<String> result = new OperationResult<>();
		result.setStatus(OperationStatus.SUCCESS);
		result.setPayload(builder.toString());
		return result;
	}

	private void addSubList(StringBuilder builder, List<TestResultEntity> results) {
		for (Iterator<TestResultEntity> iterator = results.iterator(); iterator.hasNext(); ) {
			TestResultEntity resultEntity = iterator.next();
			String givenAnswerString = resultEntity.getAnswers();
			String selfEvaluationString = resultEntity.getSelfEvaluation();
			if (givenAnswerString == null || givenAnswerString.isEmpty() || selfEvaluationString == null || selfEvaluationString.isEmpty()) {
				LOGGER.info("The student " + resultEntity.getMatriculationNumber() + " has not answered.");
				continue;
			}
			builder
					.append(resultEntity.getMatriculationNumber())
					.append(",");
			String[] selfEval = selfEvaluationString.split(",");
			builder.append(selfEval[0])
					.append(",")
					.append(selfEval[1])
					.append(",");
			builder.append(givenAnswerString);
			builder.append(",");
			builder.append(resultEntity.getScore());
			if (iterator.hasNext()) {
				builder.append("\n");
			}
		}
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
