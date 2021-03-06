package com.trent.robolab.pythontest.service;


import com.trent.robolab.pythontest.api.model.*;
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

	private int questionWeight = 4;
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
				result.setStatus(OperationStatus.DUPLICATE_FAILURE);
				LOGGER.error("The student with matriculation number " + testResult.getMatriculationNumber() + " has already answered");
				return result;
			}
			StringBuilder builder = new StringBuilder();
			List<Integer> answers = testResult.getAnswers();
			CorrectAnswersEntity correctAnswersEntity = correctAnswersRepository.findFirstBy();
			if (correctAnswersEntity == null) {
				LOGGER.error("No correct answer string was set.");
				result.setStatus(OperationStatus.FAILURE);
				return result;
			}
			String[] correctAnswers = correctAnswersEntity.getAnswers().split(",");
			if (answers.size() != correctAnswers.length) {
				LOGGER.error("Mismatch between number of given answers and correct answers config");
				result.setStatus(OperationStatus.FAILURE);
				return result;
			}
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
			float score = calculateScore(answers, testResult.getSelfEvaluation1(), testResult.getSelfEvaluation2(), false);
			entity.setScore(score);
			entity.setStudies(testResult.getStudies());
			testResultRepository.save(entity);
			LOGGER.info("Successfully saved result for matriculation number " + testResult.getMatriculationNumber());
			result.setStatus(OperationStatus.SUCCESS);
		}
		return result;
	}

	private float calculateScore(List<Integer> answers, String selfEvaluationA, String selfEvaluationB, boolean recalculate) {
		int baseScore = calculateBaseScore(answers, recalculate);
		float performance = baseScore / (float) calcMaxScore(answers.size());
		String selfEval = "CBA";
		int evalScale = 1;
		int evalScoreA = 1 + selfEval.indexOf(selfEvaluationA) * evalScale;
		int evalScoreB = 1 + selfEval.indexOf(selfEvaluationB) * evalScale;
		float evalScore = evalScoreA + evalScoreB;
		int maxEvalScore = 2 * ((selfEval.length() - 1) * evalScale) + 2;
		float selfConfidence = Math.min(1, (evalScore / maxEvalScore) + 0.4f);
		float achievedScore = evalScore * performance + baseScore * selfConfidence;
		float maxScore = calcMaxScore(answers.size()) + maxEvalScore;
		float score = Math.min(1, achievedScore / maxScore);
		score = (float) (Math.round(score * 10000.0) / 10000.0);
		LOGGER.info("CALCULATED " + score * 100);
		LOGGER.info("MAX SCORE " + maxScore);
		return score * 100;
	}

	private int calcMaxScore(int numberOfAnswers) {
		int maxScore = 0;
		for (int i = 1; i <= numberOfAnswers; i++) {
			maxScore += Math.floorDiv(i, questionWeight) + 1;
		}
		return maxScore;
	}


	private int calculateBaseScore(List<Integer> answers, boolean recalculate) {
		CorrectAnswersEntity correctAnswersEntity = correctAnswersRepository.findFirstBy();
		if (correctAnswersEntity == null) {
			LOGGER.error("No correct answer string was set.");
		}
		String[] correctAnswers = correctAnswersEntity.getAnswers().split(",");
		int baseScore = 0;
		for (int i = 0; i < answers.size(); i++) {
			String answer = Integer.toString(answers.get(i));
			if (recalculate) {
				baseScore += answer.equals("1") ? Math.floorDiv(i + 1, questionWeight) + 1 : 0;
			} else {
				baseScore += answer.equals(correctAnswers[i]) ? Math.floorDiv(i + 1, questionWeight) + 1 : 0;
			}
		}
		return baseScore;
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
			testResultEntity.setStudies("");
			testResultRepository.save(testResultEntity);

			/*TestResult result = new TestResult();
			result.setMatriculationNumber(matriculationNumber);
			result.setAnswers(generateRandomAnswer());
			result.setSelfEvaluation1(generateRandomSelfEvaluation());
			result.setSelfEvaluation2(generateRandomSelfEvaluation());
			result.setStudies(generateRandomStudies());
			addTestResult(result);*/
		}
		operationResult.setStatus(OperationStatus.SUCCESS);
		return operationResult;
	}


	private String generateRandomStudies() {
		Random random = new Random();
		int probability = random.nextInt(100);
		if (probability < 10) {
			return "physik";
		}
		return "informatik";
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
	public OperationResult<String> resetTest() {
		List<TestResultEntity> entities = (List<TestResultEntity>) testResultRepository.findAll();
		for (TestResultEntity entity : entities) {
			entity.setAnswers("");
			entity.setSelfEvaluation("");
			entity.setScore(0);
			entity.setGroupNumber(0);
			entity.setStudies("");
			testResultRepository.save(entity);
		}
		OperationResult<String> result = new OperationResult<>();
		result.setStatus(OperationStatus.SUCCESS);
		result.setPayload("Successfully reset " + testResultRepository.count() + " students.");
		return result;
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
			entity.setAnswers(builder.toString());
			entity.setCreationDate(OffsetDateTime.now());
			correctAnswersRepository.save(entity);
		}
		OperationResult<CorrectAnswers> result = new OperationResult<>();
		result.setStatus(OperationStatus.SUCCESS);
		result.setPayload(correctAnswers);
		return result;
	}

	@Override
	public OperationResult<TestResultSummary> getTestResults() {
		List<TestResultEntity> testResults = (List<TestResultEntity>) testResultRepository.findAll();
		testResults.removeIf(this::hasNotAnswered);
		StringBuilder builder = new StringBuilder();
		convertToCsv(builder, testResults);
		OperationResult<TestResultSummary> result = new OperationResult<>();
		result.setStatus(OperationStatus.SUCCESS);
		TestResultSummary summary = new TestResultSummary();
		summary.setCsv(builder.toString());
		summary.setCount(testResults.size());
		result.setPayload(summary);
		return result;
	}

	private boolean hasNotAnswered(TestResultEntity entity) {
		return entity.getAnswers() == null || entity.getAnswers().isEmpty() || entity.getSelfEvaluation() == null || entity.getSelfEvaluation().isEmpty();
	}

	@Override
	public OperationResult<String> concludeTest() {
		List<TestResultEntity> results = (List<TestResultEntity>) testResultRepository.findAll();
		List<TestResultEntity> physicists = new ArrayList<>();
		List<TestResultEntity> skippedStudents = new ArrayList<>();
		int numberOfStudents = results.size();
		StringBuilder builder = new StringBuilder();
		String foundStudents = "Found " + numberOfStudents + " students";
		LOGGER.info(foundStudents);
		builder.append(foundStudents).append("\n");

		for (Iterator<TestResultEntity> iterator = results.iterator(); iterator.hasNext(); ) {
			TestResultEntity entity = iterator.next();
			if (hasNotAnswered(entity)) {
				LOGGER.info("The student " + entity.getMatriculationNumber() + " has not answered and is skipped.");
				skippedStudents.add(entity);
				iterator.remove();
			}
			if ("physik".equals(entity.getStudies())) {
				physicists.add(entity);
				iterator.remove();
			}
		}
		String foundPhysicStudents = "Found " + physicists.size() + " physics students.\n";
		LOGGER.info(foundPhysicStudents);
		builder.append(foundPhysicStudents);

		String remainingStudents = "Remaining students:  " + results.size();
		LOGGER.info(remainingStudents);
		builder.append(remainingStudents).append("\n");

		results.sort((testResultEntity, otherEntity) -> Float.compare(testResultEntity.getScore(), otherEntity.getScore()));
		int chunkSize = Math.floorDiv(results.size(), 6);
		String chunkSizeInfo = "Chunk size:  " + chunkSize;
		LOGGER.info(chunkSizeInfo);
		builder.append(chunkSizeInfo).append("\n");

		int numberOfGroupsOfFour = results.size() % 6;

		String groupsOfFourInfo = "Groups of four:  " + numberOfGroupsOfFour;
		LOGGER.info(groupsOfFourInfo);
		builder.append(groupsOfFourInfo).append("\n");

		List<TestResultEntity> worstStudents = new ArrayList<>();
		List<TestResultEntity> bestStudents = new ArrayList<>();
		List<TestResultEntity> upperMidRange = new ArrayList<>();
		List<TestResultEntity> lowerMidRange = new ArrayList<>();
		List<TestResultEntity> leftOvers = new ArrayList<>();

		for (int i = 0; i < numberOfGroupsOfFour; i++) {
			leftOvers.add(results.get(i));
		}
		for (int i = numberOfGroupsOfFour; i < chunkSize + numberOfGroupsOfFour; i++) {
			worstStudents.add(results.get(i));
		}
		for (int i = chunkSize + numberOfGroupsOfFour; i < 3 * chunkSize + numberOfGroupsOfFour; i++) {
			lowerMidRange.add(results.get(i));
		}
		for (int i = 3 * chunkSize + numberOfGroupsOfFour; i < 5 * chunkSize + numberOfGroupsOfFour; i++) {
			upperMidRange.add(results.get(i));
		}
		for (int i = 5 * chunkSize + numberOfGroupsOfFour; i < 6 * chunkSize + numberOfGroupsOfFour; i++) {
			bestStudents.add(results.get(i));
		}

		builder.append("WORST: \n");
		convertToCsv(builder, worstStudents);
		builder.append("\n");
		builder.append("LOWER MID: \n");
		convertToCsv(builder, lowerMidRange);
		builder.append("\n");
		builder.append("UPPER MID: \n");
		convertToCsv(builder, upperMidRange);
		builder.append("\n");
		builder.append("BEST: \n");
		convertToCsv(builder, bestStudents);
		builder.append("\n");
		builder.append("LEFT OVERS: \n");
		convertToCsv(builder, leftOvers);
		builder.append("\n");
		builder.append("PHYSIC STUDENTS: \n");
		convertToCsv(builder, physicists);
		builder.append("\n");
		builder.append("SKIPPED STUDENTS WITH NO ANSWERS: \n");
		convertToCsv(builder, skippedStudents);
		builder.append("\n").append("GROUP ASSIGNMENTS: \n");
		Collections.reverse(lowerMidRange);
		Collections.reverse(worstStudents);
		List<StudentGroup> studentGroups = new ArrayList<>();
		int y = 0;
		for (TestResultEntity bestResult : bestStudents) {
			StudentGroup group = new StudentGroup();
			group.addStudents(bestResult, lowerMidRange.get(y), lowerMidRange.get(y + 1));
			if (leftOvers.size() > 0) {
				TestResultEntity leftOver = leftOvers.get(leftOvers.size() - 1);
				group.addStudents(leftOver);
				leftOvers.remove(leftOvers.size() - 1);
			}
			studentGroups.add(group);
			y += 2;
		}
		builder.append("\n");
		y = 0;

		for (TestResultEntity worstResult : worstStudents) {
			StudentGroup group = new StudentGroup();
			group.addStudents(worstResult, upperMidRange.get(y), upperMidRange.get(y + 1));
			studentGroups.add(group);
			y += 2;
		}
		if (physicists.size() > 3) {
			int numberOfPhysicianGroupsOfFour = physicists.size() % 3;
			int remainingLeftOvers = numberOfGroupsOfFour;
			for (int i = numberOfPhysicianGroupsOfFour; i < physicists.size(); i += 3) {
				StudentGroup group = new StudentGroup();
				group.addStudents(physicists.get(i), physicists.get(i + 1), physicists.get(i + 2));
				if (remainingLeftOvers > 0) {
					group.addStudents(physicists.get(remainingLeftOvers));
					remainingLeftOvers -= 1;
				}
				studentGroups.add(group);
			}
		} else {
			StudentGroup group = new StudentGroup();
			group.addStudents(physicists);
			studentGroups.add(group);
		}

		List<Integer> groupNumbers = new ArrayList<>();
		for (int i = 1; i <= studentGroups.size(); i++) {
			groupNumbers.add(i);
		}

		LOGGER.info(groupNumbers.toString());

		Random random = new Random();

		for (StudentGroup group : studentGroups) {
			int groupNumber = groupNumbers.get(random.nextInt(groupNumbers.size()));
			groupNumbers.remove(new Integer(groupNumber));
			group.assignNumber(groupNumber);
			for (TestResultEntity student : group.getStudents()) {
				student.setGroupNumber(groupNumber);
				testResultRepository.save(student);
			}
			LOGGER.info(group.toString());
			builder.append(group.toString());
		}

		OperationResult<String> result = new OperationResult<>();
		result.setStatus(OperationStatus.SUCCESS);
		result.setPayload(builder.toString());
		return result;
	}

	private void convertToCsv(StringBuilder builder, List<TestResultEntity> results) {
		for (Iterator<TestResultEntity> iterator = results.iterator(); iterator.hasNext(); ) {
			TestResultEntity resultEntity = iterator.next();
			String givenAnswerString = resultEntity.getAnswers();
			String selfEvaluationString = resultEntity.getSelfEvaluation();
			builder
					.append(resultEntity.getMatriculationNumber());
			String[] selfEval = selfEvaluationString.split(",");
			if (selfEval.length == 2) {
				builder.append(",")
						.append(selfEval[0])
						.append(",")
						.append(selfEval[1])
						.append(",");
			}
			if (!givenAnswerString.isEmpty()) {
				builder.append(givenAnswerString);
			}
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
			testResult.setGroupNumber(resultEntity.getGroupNumber());
			testResult.setStudies(resultEntity.getStudies());
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

	@Override
	public OperationResult<TestProgress> getTestProgress() {
		int totalStudents = (int) testResultRepository.count();
		int studentsThatAnswered = testResultRepository.findAllByAnswersIsNot("").size();
		TestProgress progress = new TestProgress();
		progress.studentsThatAnswered(studentsThatAnswered);
		progress.totalStudents(totalStudents);
		OperationResult<TestProgress> result = new OperationResult<>();
		result.setStatus(OperationStatus.SUCCESS);
		result.setPayload(progress);
		return result;
	}

	@Override
	public OperationResult<QuestionWeight> setQuestionWeight(QuestionWeight questionWeight) {
		this.questionWeight = questionWeight.getWeight();
		for (TestResultEntity entity : testResultRepository.findAllByAnswersIsNot("")) {
			List<String> answersAsString = Arrays.asList(entity.getAnswers().split(","));
			List<Integer> answers = new ArrayList<>();
			for (String answerString : answersAsString) {
				answers.add(Integer.parseInt(answerString));
			}
			String[] selfEvaluation = entity.getSelfEvaluation().split(",");
			float score = calculateScore(answers, selfEvaluation[0], selfEvaluation[1], true);
			entity.setScore(score);
			testResultRepository.save(entity);
		}

		OperationResult<QuestionWeight> result = new OperationResult<>();
		result.setStatus(OperationStatus.SUCCESS);
		result.setPayload(questionWeight);
		return result;
	}
}
