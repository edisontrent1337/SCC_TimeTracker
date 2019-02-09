package com.trent.scc.timingservice.service;


import com.trent.scc.timingservice.api.model.Achievement;
import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.api.model.ServiceStatistic;
import com.trent.scc.timingservice.repository.ActivityRecordEntity;

import java.time.OffsetDateTime;
import java.util.List;

public interface ITimingService {

	OperationResult<Activity> addActivity(Activity activity);
	OperationResult<Activity> getActivity(String activityUuid);
	OperationResult<Activity> updateActivity(Activity updatedActivity);
	OperationResult<Activity> removeActivity(String activityUuid);

	OperationResult<ActivityRecord> addRecord(ActivityRecord record);
	OperationResult<ActivityRecord> getRecord(String recordUuid);
	OperationResult<ActivityRecord> updateRecord(ActivityRecord record);
	OperationResult<ActivityRecord> removeRecord(String recordUuid);

	OperationResult<ServiceStatistic> getServiceStatistics();

	ActivityRecordEntity getLatestRecordForActivity(String activityUuid) throws NoSuchElementException;

	List<ActivityRecord> getRecordsForUserAndDay(String userUuid, OffsetDateTime dateTime);
	List<ActivityRecord> getRecordsForUser(String userUuid);
	List<ActivityRecord> getRecordsForUserAndTag(String userUuid, String tag);
	List<ActivityRecord> getRecordsForUserAndActivity(String activityUuid, String userUuid);
	List<ActivityRecord> getRecordsForTag(String tag);

	OperationResult<Achievement> createAchievement(Achievement achievement);
	OperationResult<Achievement> updateAchievement(Achievement achievement);
	OperationResult<Achievement> getAchievement(String achievementUuid);
	OperationResult<List<Achievement>> getAchievements();

	long getTotalDurationOfActivity(String activityUuid);

	List<Activity> getActivitiesForUser(String userUuid);

	List<ActivityRecord> getRecordsForUserAndState(String userUuid, String state);
}
