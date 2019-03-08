package com.trent.robolab.pythontest.repository;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "test_results")
public class TestResultEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Column(name = "martriculation_number")
	private int matriculationNumber;

	@Column(name = "creationDate")
	private OffsetDateTime creationDate;

	@Column(name = "answers")
	private String answers;

	@Column(name = "self_evaluation")
	private String selfEvaluation;


	@Column(name = "score")
	private float score;

	public float getScore() {
		return score;
	}

	public void setScore(float score) {
		this.score = score;
	}

	public String getSelfEvaluation() {
		return selfEvaluation;
	}

	public void setSelfEvaluation(String selfEvaluation) {
		this.selfEvaluation = selfEvaluation;
	}

	@Column(name = "uuid")
	private String uuid;

	public long getId() {
		return id;
	}

	public String getAnswers() {
		return answers;
	}

	public void setAnswers(String answers) {
		this.answers = answers;
	}

	public void setId(long id) {
		this.id = id;
	}

	public int getMatriculationNumber() {
		return matriculationNumber;
	}

	public void setMatriculationNumber(int matriculationNumber) {
		this.matriculationNumber = matriculationNumber;
	}

	public OffsetDateTime getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(OffsetDateTime creationDate) {
		this.creationDate = creationDate;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
}
