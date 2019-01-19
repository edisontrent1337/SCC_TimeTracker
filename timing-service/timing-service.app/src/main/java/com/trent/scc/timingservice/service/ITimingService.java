package com.trent.scc.timingservice.service;


import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.repository.ActivityRecordEntity;

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

	OperationResult<?> getApplicationStatistics();

	ActivityRecordEntity getLatestRecordForActivity(String activityUuid) throws NoSuchElementException;

	List<ActivityRecord> getRecordsForUser(String userUuid);
	List<ActivityRecord> getRecordsForUserAndTag(String userUuid, String tag);
	List<ActivityRecord> getRecordsForUserAndActivity(String activityUuid, String userUuid);
	List<ActivityRecord> getRecordsForTag(String tag);

	long getTotalDurationOfActivity(String activityUuid);

	List<Activity> getActivitiesForUser(String userUuid);
}
