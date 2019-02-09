package com.trent.scc.timingservice.repository;

import org.springframework.data.repository.CrudRepository;

import java.time.OffsetDateTime;

public interface AchievementRepository extends CrudRepository<AchievementEntity, Long> {
	AchievementEntity findByActivivtyUuidAndFromAndToAndOwnerUuid(String activityUuid, OffsetDateTime from, OffsetDateTime to, String ownerUuid);
}
