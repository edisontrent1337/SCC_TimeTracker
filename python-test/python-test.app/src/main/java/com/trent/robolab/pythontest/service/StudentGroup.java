package com.trent.robolab.pythontest.service;

import com.trent.robolab.pythontest.repository.TestResultEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class StudentGroup {
	private List<TestResultEntity> students = new ArrayList<>();
	private static final Logger LOGGER = LoggerFactory.getLogger(StudentGroup.class);
	private int number;
	private float groupSkill = 0;

	public StudentGroup(TestResultEntity... students) {
		this.students.addAll(Arrays.asList(students));
	}

	public void addStudents(TestResultEntity... students) {
		if (this.students.size() < 5) {
			this.students.addAll(Arrays.asList(students));
			calculateGroupSkill();
		} else {
			LOGGER.error("Can not add another student to this group.");
		}
	}

	private void calculateGroupSkill() {
		float aggregatedSkill = 0;
		for (TestResultEntity entity : students) {
			aggregatedSkill += entity.getScore();
		}

		this.groupSkill = aggregatedSkill / students.size();
	}


	public void assignNumber(int number) {
		this.number = number;
		for (TestResultEntity entity : students) {
			entity.setGroupNumber(number);
		}
	}

	public List<TestResultEntity> getStudents() {
		return students;
	}

	public float getGroupSkill() {
		return groupSkill;
	}

	public void addStudents(List<TestResultEntity> students) {
		for (TestResultEntity student : students) {
			addStudents(student);
		}
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		for (TestResultEntity entity : students) {
			//builder.append(entity.toString()).append(" GROUP: ").append(number).append("\n");
			builder.append(entity.toString()).append(",").append(number).append("\n");
		}
		builder.append("\n");
		return builder.toString();
	}
}
