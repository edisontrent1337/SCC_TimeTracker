package com.trent.robolab.pythontest.repository;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "testresults")
public class TestResultEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@Column(name = "martricle_number")
	private int matricleNumber;
	@Column(name = "activity_uuid")
	private String activivtyUuid;

	@Column(name = "creationDate")
	private OffsetDateTime creationDate;

	@Column(name="uuid")
	private String uuid;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public int getMatricleNumber() {
		return matricleNumber;
	}

	public void setMatricleNumber(int matricleNumber) {
		this.matricleNumber = matricleNumber;
	}

	public String getActivivtyUuid() {
		return activivtyUuid;
	}

	public void setActivivtyUuid(String activivtyUuid) {
		this.activivtyUuid = activivtyUuid;
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
