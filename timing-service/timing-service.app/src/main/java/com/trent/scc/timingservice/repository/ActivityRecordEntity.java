package com.trent.scc.timingservice.repository;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "activity_records")
public class ActivityRecordEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Column(name = "uuid")
	private String uuid;

	@Column(name = "state")
	private String state;

	@Column(name = "activity_uuid")
	private String activityUuid;

	@Column(name = "duration")
	private long duration;

	@Column(name="start_time")
	private OffsetDateTime startTime;

	@Column(name="end_time")
	private OffsetDateTime endTime;

	public long getDuration() {
		return duration;
	}

	public void setDuration(long duration) {
		this.duration = duration;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getActivityUuid() {
		return activityUuid;
	}

	public void setActivityUuid(String activityUuid) {
		this.activityUuid = activityUuid;
	}

	public OffsetDateTime getStartTime() {
		return startTime;
	}

	public void setStartTime(OffsetDateTime startTime) {
		this.startTime = startTime;
	}

	public OffsetDateTime getEndTime() {
		return endTime;
	}

	public void setEndTime(OffsetDateTime endTime) {
		this.endTime = endTime;
	}

	@Override
	public String toString() {
		return "ActivityRecordEntity{" +
				"id=" + id +
				", uuid='" + uuid + '\'' +
				", state='" + state + '\'' +
				", activityUuid='" + activityUuid + '\'' +
				", duration=" + duration +
				", startTime=" + startTime +
				", endTime=" + endTime +
				'}';
	}
}
