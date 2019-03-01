package com.trent.robolab.pythontest.repository;

import org.springframework.data.repository.CrudRepository;

public interface CorrectAnswersRepository extends CrudRepository<CorrectAnswersEntity, Long> {
	CorrectAnswersEntity findById(long id);
}
