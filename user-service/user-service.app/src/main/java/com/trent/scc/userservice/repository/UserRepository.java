package com.trent.scc.userservice.repository;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<UserEntity, Long> {
	UserEntity findByName(String name);
	UserEntity findByUuid(String userUuid);
}
