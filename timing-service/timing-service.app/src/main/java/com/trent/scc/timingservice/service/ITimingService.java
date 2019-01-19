package com.trent.scc.timingservice.service;


import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.repository.ActivityRecordEntity;

import java.util.List;

public interface ITimingService {

	OperationResult<Activity> addActivity(Activity activity);
	OperationResult<Activity> removeActivity(String activityUuid);
	OperationResult<Activity> updateActivity(Activity updatedActivity) throws NoSuchElementException;
	OperationResult<Activity> deleteActivity(String activityUuid) throws NoSuchElementException;

	OperationResult<ActivityRecord> addRecord(ActivityRecord record);
	OperationResult<ActivityRecord> removeRecord(String recordUuid);
	OperationResult<ActivityRecord> updateRecord(ActivityRecord record) throws NoSuchElementException;
	OperationResult<ActivityRecord> deleteRecord(String recordUuid) throws NoSuchElementException;


	OperationResult<?> getApplicationStatistics();

	ActivityRecordEntity getLatestRecordForActivity(String activityUuid) throws NoSuchElementException;

	List<ActivityRecord> getAllRecordsForUser(String userUuid);
	List<ActivityRecord> getAllRecordsForTag(String tag);
	List<ActivityRecord> getAllRecordsForUserAndTag(String userUuid, String tag);

	long getTotalDurationOfActivity(String activityUuid);
}
