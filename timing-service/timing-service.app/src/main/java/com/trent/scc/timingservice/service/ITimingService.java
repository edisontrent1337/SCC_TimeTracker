package com.trent.scc.timingservice.service;


import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.repository.ActivityRecordEntity;

import java.util.List;

public interface ITimingService {
	OperationResult<Activity> addActivity(Activity activity);
	OperationResult<ActivityRecord> addRecord(ActivityRecord record);
	OperationStatus removeRecord(String recordUuid);
	ActivityRecord updateRecord(ActivityRecord record) throws NoSuchElementException;
	OperationStatus deleteRecord(String recordUuid);
	OperationStatus getApplicationStatistics();
	ActivityRecordEntity getLatestRecordForActivity(String activityUuid) throws NoSuchElementException;
	List<ActivityRecord> getAllRecordsForUser(String userUuid);
	long getTotalDurationOfActivity(String activityUuid);
}
