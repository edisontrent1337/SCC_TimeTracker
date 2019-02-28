package com.trent.scc.timingservice.repository;

import com.trent.scc.timingservice.api.model.Achievement;
import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EntityCreator {

	public static ActivityRecordEntity recordEntity(ActivityRecord record) {
		ActivityRecordEntity entity = new ActivityRecordEntity();
		entity.setActivityUuid(record.getActivityuuid());
		entity.setState(ActivityRecord.StateEnum.STARTED.toString());
		entity.setUuid(UUID.randomUUID().toString());
		entity.setTag(record.getTag());
		if (record.getTime() != null) {
			entity.setStartTime(record.getTime());
		} else {
			entity.setStartTime(OffsetDateTime.now());
		}
		return entity;
	}

	public static ActivityEntity activityEntity(Activity activity) {
		ActivityEntity entity = new ActivityEntity();
		entity.setCreationDate(OffsetDateTime.now());
		entity.setModificationDate(OffsetDateTime.now());
		entity.setName(activity.getName());
		entity.setDescription(activity.getDescription());
		entity.setOwnerUuid(activity.getOwneruuid());
		entity.setUuid(UUID.randomUUID().toString());
		String tag = activity.getTag();
		if (tag != null) {
			entity.setTag(tag);
		}
		return entity;
	}

	public static Activity toActivity(ActivityEntity entity, ActivityRecordRepository activityRecordRepository) {
		Activity activity = new Activity();
		activity.setUuid(entity.getUuid());
		activity.setDescription(entity.getDescription());
		activity.setName(entity.getName());
		activity.setOwneruuid(entity.getOwnerUuid());
		activity.setTag(entity.getTag());

		List<ActivityRecordEntity> startedRecord = activityRecordRepository.findAllByActivityUuidAndState(entity.getUuid(), ActivityRecord.StateEnum.STARTED.toString());
		if (startedRecord.size() == 1) {
			ActivityRecordEntity record = startedRecord.get(0);
			activity.setState(ActivityRecord.StateEnum.STARTED.toString());
			activity.setDuration((int) (OffsetDateTime.now().toEpochSecond() - record.getStartTime().toEpochSecond()));
		}

		return activity;
	}

	public static ActivityRecord toRecord(ActivityRecordEntity recordEntity) {
		ActivityRecord result = new ActivityRecord();
		result.setDuration((int) recordEntity.getDuration());
		result.setActivityuuid(recordEntity.getActivityUuid());
		result.setState(ActivityRecord.StateEnum.valueOf(recordEntity.getState()));
		result.setTag(recordEntity.getTag());
		result.startTime(recordEntity.getStartTime());
		result.setEndTime(recordEntity.getEndTime());
		result.setUuid(recordEntity.getUuid());
		return result;
	}

	public static AchievementEntity achievementEntity(Achievement achievement) {
		AchievementEntity entity = new AchievementEntity();
		entity.setActivivtyUuid(achievement.getActivityUuid());
		entity.setDuration(achievement.getDuration());
		entity.setOwnerUuid(achievement.getOwnerUuid());
		entity.setProgress(achievement.getProgress());
		entity.setFrom(achievement.getFrom());
		entity.setTo(achievement.getTo());
		entity.setUuid(UUID.randomUUID().toString());
		return entity;
	}

	public static Achievement toAchievement(AchievementEntity entity) {
		Achievement achievement = new Achievement();
		achievement.setActivityUuid(entity.getActivivtyUuid());
		achievement.setDuration((int) entity.getDuration());
		achievement.setFrom(entity.getFrom());
		achievement.setTo(entity.getTo());
		achievement.setOwnerUuid(entity.getOwnerUuid());
		return achievement;
	}
}
