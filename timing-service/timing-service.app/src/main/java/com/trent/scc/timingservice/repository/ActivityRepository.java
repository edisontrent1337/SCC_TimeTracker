package com.trent.scc.timingservice.repository;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ActivityRepository extends CrudRepository<ActivityEntity, Long> {
	ActivityEntity findByNameAndOwnerUuid(String name, String ownerUuid);
	ActivityEntity findByUuid(String uuid);
	List<ActivityEntity> findAllByOwnerUuid(String ownerUuid);
	List<ActivityEntity> findAllByTag(String tag);
}
