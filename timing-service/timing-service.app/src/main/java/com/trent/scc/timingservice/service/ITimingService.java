package com.trent.scc.timingservice.service;


import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;

public interface ITimingService {
	OperationStatus createActivity(Activity activity);
	OperationStatus addRecord(ActivityRecord record);
	OperationStatus removeRecord(String recordUuid);
	OperationStatus updateRecord(ActivityRecord record);
	OperationStatus deleteRecord(String recordUuid);
	OperationStatus getApplicationStatistics();
}
