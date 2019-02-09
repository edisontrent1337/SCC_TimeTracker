package com.trent.scc.timingservice.repository;

import javax.persistence.*;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import java.time.OffsetDateTime;

@Entity
@Table(name = "achievements")
public class AchievementEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@Column(name = "owner_uuid")
	private String ownerUuid;
	@Column(name = "activity_uuid")
	private String activivtyUuid;

	@Column(name = "from_date")
	private OffsetDateTime from;

	@Column(name = "to_date")
	private OffsetDateTime to;

	@Column(name = "duration")
	private long duration;

	@DecimalMin("0.00")
	@DecimalMax("1.00")
	@Column(name = "progress")
	private float progress;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getOwnerUuid() {
		return ownerUuid;
	}

	public void setOwnerUuid(String ownerUuid) {
		this.ownerUuid = ownerUuid;
	}

	public String getActivivtyUuid() {
		return activivtyUuid;
	}

	public void setActivivtyUuid(String activivtyUuid) {
		this.activivtyUuid = activivtyUuid;
	}

	public OffsetDateTime getFrom() {
		return from;
	}

	public void setFrom(OffsetDateTime from) {
		this.from = from;
	}

	public OffsetDateTime getTo() {
		return to;
	}

	public void setTo(OffsetDateTime to) {
		this.to = to;
	}

	public long getDuration() {
		return duration;
	}

	public void setDuration(long duration) {
		this.duration = duration;
	}

	public float getProgress() {
		return progress;
	}

	public void setProgress(float progress) {
		this.progress = progress;
	}
}
