package com.trent.robolab.pythontest.repository;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "correct_answers")
public class CorrectAnswersEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Column(name = "creationDate")
	private OffsetDateTime creationDate;

	@Column(name = "answers")
	private String answers;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public OffsetDateTime getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(OffsetDateTime creationDate) {
		this.creationDate = creationDate;
	}

	public String getAnswers() {
		return answers;
	}

	public void setAnswers(String answers) {
		this.answers = answers;
	}
}
