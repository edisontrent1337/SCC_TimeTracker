package com.trent.scc.timingservice.controller;

import com.trent.scc.timingservice.api.ActivitiesApi;
import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.api.model.OperationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;
import java.util.List;

public class TimingServiceController implements ActivitiesApi {

	@Override
	public ResponseEntity<OperationResponse> addActivityRecord(@Valid @RequestBody ActivityRecord body, @PathVariable String activityId) {
		return null;
	}

	@Override
	public ResponseEntity<OperationResponse> getGlobalActivityStats() {
		return null;
	}

	@Override
	public ResponseEntity<OperationResponse> createActivity(@RequestBody @Valid Activity body) {
		return null;
	}

	@Override
	public ResponseEntity<List<Activity>> getActivities() {
		return null;
	}

	@Override
	public ResponseEntity<OperationResponse> getActivity(@PathVariable String activityId) {
		return null;
	}

	@Override
	public ResponseEntity<OperationResponse> getActivityRecords(@PathVariable String activityId) {
		return null;
	}
}
