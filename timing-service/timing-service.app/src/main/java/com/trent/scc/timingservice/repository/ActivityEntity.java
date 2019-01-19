package com.trent.scc.timingservice.repository;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.OffsetDateTime;

@Entity
@Table(name = "activities")
public class ActivityEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@NotBlank
	@Column(name = "name")
	private String name;

	@NotBlank
	@Column(name = "description")
	private String description;

	@Column(name = "creation_date")
	private OffsetDateTime creationDate;

	@Column(name = "modification_date")
	private OffsetDateTime modificationDate;

	@Column(name = "owner_uuid")
	private String ownerUuid;

	@Column(name = "uuid")
	private String uuid;

	@Column(name = "tag")
	private String tag;

	public String getTag() {
		return tag;
	}

	public void setTag(String tag) {
		this.tag = tag;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public OffsetDateTime getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(OffsetDateTime creationDate) {
		this.creationDate = creationDate;
	}

	public OffsetDateTime getModificationDate() {
		return modificationDate;
	}

	public void setModificationDate(OffsetDateTime modificationDate) {
		this.modificationDate = modificationDate;
	}

	public String getOwnerUuid() {
		return ownerUuid;
	}

	public void setOwnerUuid(String ownerUuid) {
		this.ownerUuid = ownerUuid;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

}
