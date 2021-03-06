package com.trent.scc.timingservice.repository;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ActivityRecordRepository extends CrudRepository<ActivityRecordEntity, Long> {
	List<ActivityRecordEntity> findAllByActivityUuid(String activityUuid);
	List<ActivityRecordEntity> findAllByTag(String tag);
	List<ActivityRecordEntity> findAllByActivityUuidAndState(String activityUuid, String state);

	void deleteAllByActivityUuid(String activityUuid);

	ActivityRecordEntity findByUuid(String uuid);
}
