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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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
	public ResponseEntity<OperationResponse> addActivityRecord(@PathVariable String activityId) {
		ActivityRecord record = new ActivityRecord();
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
	public ResponseEntity<OperationResponse> updateActivity(@RequestBody @Valid Activity activity) {
		OperationResponse response = new OperationResponse();
		OperationResult<Activity> result = timingService.updateActivity(activity);
		Activity payload = result.getPayload();
		switch (result.getStatus()) {
			case SUCCESS:
				response.addDataItem(payload);
				return new ResponseEntity<>(response, HttpStatus.OK);
			case NOT_EXISTING:
				response.error("Can not create a record for " + activity.getUuid() + " as this activity does not exist.");
				return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		response.error("Unexpected error occurred.");
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
	public ResponseEntity<OperationResponse> getActivities() {
		OperationResponse response = new OperationResponse();
		String userUuid = getUserAuthentication();
		List<Activity> activityEntities = timingService.getActivitiesForUser(userUuid);
		response.addDataItem(activityEntities);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<OperationResponse> getActivity(@PathVariable String activityId) {
		OperationResponse response = new OperationResponse();
		OperationResult<Activity> operationResult = timingService.getActivity(activityId);
		switch (operationResult.getStatus()) {
			case SUCCESS:
				response.addDataItem(operationResult.getPayload());
				return new ResponseEntity<>(response, HttpStatus.OK);
			case NOT_EXISTING:
				response.error("The activity with the id " + activityId + " does not exist");
				return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		response.error("An unexpected error occurred.");
		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@Override
	public ResponseEntity<OperationResponse> getActivityRecords(@PathVariable String activityId) {
		OperationResponse response = new OperationResponse();
		String userUuid = getUserAuthentication();
		List<ActivityRecord> records = timingService.getRecordsForUserAndActivity(activityId, userUuid);
		response.addDataItem(records);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<OperationResponse> getRecords(
			@Valid @RequestParam(value = "tag", required = false) String tag,
			@Valid @RequestParam(value = "activityUuid", required = false) String activityUuid,
			@Valid @RequestParam(value = "state", required = false) String state
	) {
		OperationResponse response = new OperationResponse();
		String userUuid = getUserAuthentication();
		List<ActivityRecord> records;
		if(tag != null) {
			records = timingService.getRecordsForUserAndTag(userUuid, tag);
		}
		else if (activityUuid != null) {
			records = timingService.getRecordsForUserAndActivity(activityUuid, userUuid);
		}
		else if (state != null) {
			records = timingService.getRecordsForUserAndState(userUuid, state);
		}
		else {
			records = timingService.getRecordsForUser(userUuid);
		}
		response.addDataItem(records);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}


	@Override
	@Transactional
	public ResponseEntity<OperationResponse> deleteActivity(@PathVariable String activityId) {
		OperationResult<Activity> operationResult = timingService.removeActivity(activityId);
		OperationStatus status = operationResult.getStatus();
		OperationResponse response = new OperationResponse();
		response.addDataItem(activityId);
		switch (status) {
			case SUCCESS:
				return new ResponseEntity<>(response, HttpStatus.OK);
			case NOT_EXISTING:
				response.error("The activity with the id " + activityId + " does not exist");
				return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		response.error("An unexpected error occurred.");
		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	private String getUserAuthentication() {
		SecurityContext securityContext = SecurityContextHolder.getContext();
		Authentication authentication = securityContext.getAuthentication();
		return authentication.getName();
	}
}
