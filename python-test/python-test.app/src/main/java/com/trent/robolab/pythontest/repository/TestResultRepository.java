package com.trent.robolab.pythontest.repository;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TestResultRepository extends CrudRepository<TestResultEntity, Long> {
	TestResultEntity findByMatriculationNumber(int matriculationNumber);
	List<TestResultEntity> findAllByAnswersIsNot(String answers);
}
