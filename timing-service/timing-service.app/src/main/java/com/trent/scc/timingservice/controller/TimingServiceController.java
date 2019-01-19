package com.trent.scc.timingservice.controller;

import com.trent.scc.timingservice.api.ActivitiesApi;
import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.api.model.OperationResponse;
import com.trent.scc.timingservice.service.OperationResult;
import com.trent.scc.timingservice.service.OperationStatus;
import com.trent.scc.timingservice.service.TimingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
public class TimingServiceController implements ActivitiesApi {

	private final TimingService timingService;

	@Autowired
	public TimingServiceController(TimingService timingService) {
		this.timingService = timingService;
	}

	@Override
	public ResponseEntity<OperationResponse> addActivityRecord(@Valid @RequestBody ActivityRecord record, @PathVariable String activityId) {
		String ownerUuid = getUserAuthentication();
		record.setOwneruuid(ownerUuid);
		record.setActivityuuid(activityId);
		OperationResult<ActivityRecord> result = timingService.addRecord(record);
		ActivityRecord payload = result.getPayload();
		OperationResponse response = new OperationResponse();
		switch (result.getStatus()) {
			case SUCCESS:
				response.addDataItem(payload);
				break;
			case NOT_EXISTING:
				response.error("Can not create a record for " + activityId + " as this activity does not exist.");
				break;
			case FAILURE:
				response.error("Unexpected error occurred.");
				break;
			case UNAUTHORIZED:
				response.error("You are not authorized to add a record for " + activityId);
				break;
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<OperationResponse> getGlobalActivityStats() {
		return null;
	}

	@Override
	public ResponseEntity<OperationResponse> createActivity(@RequestBody @Valid Activity activity) {
		String ownerUuid = getUserAuthentication();
		activity.setOwneruuid(ownerUuid);
		OperationResult<Activity> operationResult = timingService.addActivity(activity);
		OperationStatus status = operationResult.getStatus();
		Activity payload = operationResult.getPayload();
		OperationResponse response = new OperationResponse();
		switch (status) {
			case SUCCESS:
				break;
			case DUPLICATE_FAILURE:
				response.error("An activity with this name already exists");
				break;
			case FAILURE:
				response.error("An unexpected error occurred while processing the request");
				break;
			case UNAUTHORIZED:
				response.error("Unauthorized");
				break;
		}
		response.addDataItem(payload);
		return new ResponseEntity<>(response, HttpStatus.OK);
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

	@Override
	public ResponseEntity<OperationResponse> getAllRecordsForUser() {
		OperationResponse response = new OperationResponse();
		String userUuid = getUserAuthentication();
		List<ActivityRecord> records = timingService.getAllRecordsForUser(userUuid);
		response.addDataItem(records);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	private String getUserAuthentication() {
		SecurityContext securityContext = SecurityContextHolder.getContext();
		Authentication authentication = securityContext.getAuthentication();
		return authentication.getName();
	}
}
