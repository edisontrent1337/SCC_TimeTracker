package com.trent.scc.userservice.repository;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@NotBlank
	@Column(name = "name")
	private String name;

	@NotBlank
	@Column(name = "password")
	private String password;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "registrationdate")
	private Date registrationDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "lastlogin")
	private Date lastLogin;

	@Column(name = "uuid")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private String uuid;

	public UserEntity() {

	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getPassword() {
		return password;
	}

	public Date getRegistrationDate() {
		return registrationDate;
	}

	public Date getLastLogin() {
		return lastLogin;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setRegistrationDate(Date registrationDate) {
		this.registrationDate = registrationDate;
	}

	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}

	@Override
	public String toString() {
		return "UserEntity{" +
				"id=" + id +
				", name='" + name + '\'' +
				", password='" + password + '\'' +
				", registrationDate=" + registrationDate +
				", lastLogin=" + lastLogin +
				'}';
	}
}
