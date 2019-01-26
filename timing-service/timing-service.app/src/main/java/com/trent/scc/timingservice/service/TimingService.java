package com.trent.scc.timingservice.service;


import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.api.model.ActivityRecord.StateEnum;
import com.trent.scc.timingservice.repository.ActivityEntity;
import com.trent.scc.timingservice.repository.ActivityRecordEntity;
import com.trent.scc.timingservice.repository.ActivityRecordRepository;
import com.trent.scc.timingservice.repository.ActivityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.*;

import static com.trent.scc.timingservice.api.model.ActivityRecord.StateEnum.ENDED;
import static com.trent.scc.timingservice.api.model.ActivityRecord.StateEnum.STARTED;
import static com.trent.scc.timingservice.service.OperationStatus.*;

@Service
public class TimingService implements ITimingService {

	private final Logger LOGGER = LoggerFactory.getLogger(TimingService.class);

	private final ActivityRepository activityRepository;

	private final ActivityRecordRepository activityRecordRepository;

	@Autowired
	public TimingService(ActivityRepository activityRepository, ActivityRecordRepository activityRecordRepository) {
		this.activityRepository = activityRepository;
		this.activityRecordRepository = activityRecordRepository;
	}

	@Override
	public OperationResult<Activity> addActivity(Activity activity) {
		String name = activity.getName();
		ActivityEntity existingActivity = activityRepository.findByNameAndOwnerUuid(name, activity.getOwneruuid());
		if (existingActivity == null) {
			ActivityEntity entity = createNewEntity(activity);
			activityRepository.save(entity);
			activity.setUuid(entity.getUuid());
			return new OperationResult<>(activity, SUCCESS);
		} else {
			return new OperationResult<>(activity, DUPLICATE_FAILURE);
		}
	}

	@Override
	public OperationResult<ActivityRecord> addRecord(ActivityRecord record) {
		if (record.getTime() == null) {
			record.setTime(OffsetDateTime.now().plusMinutes(50));
		}
		ActivityEntity storedActivity = findActivityForRecord(record);
		OperationResult<ActivityRecord> result = new OperationResult<>();
		if (storedActivity == null) {
			result.setStatus(NOT_EXISTING);
			return result;
		} else {
			ActivityRecordEntity newRecordEntity = createNewEntityFromRecord(record);
			newRecordEntity.setTag(storedActivity.getTag());
			List<ActivityRecordEntity> storedRecords = activityRecordRepository.findAllByActivityUuid(record.getActivityuuid());
			String activityName = storedActivity.getName();
			if (storedRecords.isEmpty()) {
				activityRecordRepository.save(newRecordEntity);
				record = createNewRecordFromEntity(newRecordEntity);
			} else {
				ActivityRecordEntity lastRecordEntity = storedRecords.get(storedRecords.size() - 1);
				if ("STARTED".equals(lastRecordEntity.getState())) {
					lastRecordEntity.setState(ENDED.toString());
					lastRecordEntity.setEndTime(record.getTime());
					long duration = lastRecordEntity.getEndTime().toEpochSecond() - lastRecordEntity.getStartTime().toEpochSecond();
					lastRecordEntity.setDuration(duration);
					activityRecordRepository.save(lastRecordEntity);
					record = createNewRecordFromEntity(lastRecordEntity);
				} else {
					activityRecordRepository.save(newRecordEntity);
					record = createNewRecordFromEntity(newRecordEntity);
				}
			}
			record.setActivityName(activityName);
			result.setStatus(SUCCESS);
			result.setPayload(record);
			return result;
		}
	}

	private ActivityRecordEntity createNewEntityFromRecord(ActivityRecord record) {
		ActivityRecordEntity entity = new ActivityRecordEntity();
		entity.setActivityUuid(record.getActivityuuid());
		entity.setState(STARTED.toString());
		entity.setUuid(UUID.randomUUID().toString());
		entity.setTag(record.getTag());
		if (record.getTime() != null) {
			entity.setStartTime(record.getTime());
		} else {
			entity.setStartTime(OffsetDateTime.now());
		}
		return entity;
	}

	@Override
	public OperationResult<ActivityRecord> removeRecord(String recordUuid) {
		OperationResult<ActivityRecord> result = new OperationResult<>();
		ActivityRecordEntity recordEntity = activityRecordRepository.findByUuid(recordUuid);
		if (recordEntity != null) {
			activityRecordRepository.delete(recordEntity);
			result.setStatus(SUCCESS);
			result.setPayload(createNewRecordFromEntity(recordEntity));
			return result;
		} else {
			result.setStatus(NOT_EXISTING);
			result.setPayload(null);
			return result;
		}
	}

	@Override
	public OperationResult<ActivityRecord> updateRecord(ActivityRecord record) {
		return null;
	}

	@Override
	public OperationResult<ActivityRecord> getRecord(String recordUuid) {
		return null;
	}

	@Override
	public OperationResult<?> getApplicationStatistics() {
		return null;
	}

	@Override
	public OperationResult<Activity> removeActivity(String activityUuid) {
		ActivityEntity entity = activityRepository.findByUuid(activityUuid);
		OperationResult<Activity> result = new OperationResult<>();
		if (entity != null) {
			activityRepository.delete(entity);
			activityRecordRepository.deleteAllByActivityUuid(activityUuid);
			result.setStatus(SUCCESS);
		} else {
			result.setStatus(NOT_EXISTING);
		}

		return result;
	}

	@Override
	public OperationResult<Activity> updateActivity(Activity updatedActivity) {
		OperationResult<Activity> result = new OperationResult<>();
		String activityUuid = updatedActivity.getUuid();
		ActivityEntity entity = activityRepository.findByUuid(activityUuid);
		if (entity == null) {
			result.setStatus(NOT_EXISTING);
			return result;
		} else {
			entity.setName(updatedActivity.getName());
			entity.setDescription(updatedActivity.getDescription());
			entity.setTag(updatedActivity.getTag());

			List<ActivityRecordEntity> records = activityRecordRepository.findAllByActivityUuid(activityUuid);
			for (ActivityRecordEntity recordEntity : records) {
				recordEntity.setTag(updatedActivity.getTag());
				activityRecordRepository.save(recordEntity);
			}

			activityRepository.save(entity);
			result.setStatus(SUCCESS);
			result.setPayload(updatedActivity);
			return result;
		}
	}

	@Override
	public OperationResult<Activity> getActivity(String activityUuid) {
		OperationResult<Activity> result = new OperationResult<>();
		ActivityEntity entity = activityRepository.findByUuid(activityUuid);
		if (entity == null) {
			result.setStatus(NOT_EXISTING);
			return result;
		} else {
			Activity activity = createActivityFromEntity(entity);
			result.setPayload(activity);
			result.setStatus(SUCCESS);
			return result;
		}
	}

	@Override
	public long getTotalDurationOfActivity(String activityUuid) {
		long result = 0;
		List<ActivityRecordEntity> records = activityRecordRepository.findAllByActivityUuid(activityUuid);
		for (ActivityRecordEntity entity : records) {
			result += entity.getDuration();
		}
		return result;
	}

	@Override
	public List<Activity> getActivitiesForUser(String userUuid) {
		List<ActivityEntity> activityEntities = activityRepository.findAllByOwnerUuid(userUuid);
		List<Activity> result = new ArrayList<>();
		for (ActivityEntity entity : activityEntities) {
			result.add(createActivityFromEntity(entity));
		}
		return result;
	}

	@Override
	public ActivityRecordEntity getLatestRecordForActivity(String activityUuid) throws NoSuchElementException {
		List<ActivityRecordEntity> records = activityRecordRepository.findAllByActivityUuid(activityUuid);
		if (records == null || records.isEmpty()) {
			throw new NoSuchElementException("There exist no records for activity " + activityUuid);
		} else {
			LOGGER.info(records.get(records.size() - 1).toString());
			return records.get(records.size() - 1);
		}
	}

	@Override
	public List<ActivityRecord> getRecordsForUser(String userUuid) {
		List<ActivityRecord> result = new ArrayList<>();
		List<ActivityEntity> userActivities = activityRepository.findAllByOwnerUuid(userUuid);

		for (ActivityEntity activityEntity : userActivities) {
			String activityUuid = activityEntity.getUuid();
			List<ActivityRecordEntity> records = activityRecordRepository.findAllByActivityUuid(activityUuid);
			for (ActivityRecordEntity recordEntity : records) {
				ActivityRecord record = createNewRecordFromEntity(recordEntity);
				record.setActivityName(activityEntity.getName());
				result.add(record);
			}
		}
		Collections.sort(result, Comparator.comparing(ActivityRecord::getStartTime));
		for(ActivityRecord record : result) {
			LOGGER.info(record.getActivityName());
		}
		return result;
	}

	@Override
	public List<ActivityRecord> getRecordsForTag(String tag) {
		List<ActivityRecord> result = new ArrayList<>();
		List<ActivityRecordEntity> recordEntities = activityRecordRepository.findAllByTag(tag);
		for (ActivityRecordEntity recordEntity : recordEntities) {
			result.add(createNewRecordFromEntity(recordEntity));
		}
		return result;
	}

	@Override
	public List<ActivityRecord> getRecordsForUserAndTag(String ownerUuid, String tag) {
		List<ActivityRecord> result = new ArrayList<>();
		List<ActivityEntity> taggedUserActivities = activityRepository.findAllByOwnerUuidAndTag(ownerUuid, tag);
		for (ActivityEntity activityEntity : taggedUserActivities) {
			List<ActivityRecordEntity> recordEntities = activityRecordRepository.findAllByActivityUuid(activityEntity.getUuid());
			for (ActivityRecordEntity recordEntity : recordEntities) {
				result.add(createNewRecordFromEntity(recordEntity));
			}
		}
		return result;
	}

	@Override
	public List<ActivityRecord> getRecordsForUserAndActivity(String activityUuid, String userUuid) {
		List<ActivityRecord> userRecords = getRecordsForUser(userUuid);
		List<ActivityRecord> result = new ArrayList<>();
		for (ActivityRecord record : userRecords) {
			if (activityUuid.equals(record.getActivityuuid())) {
				result.add(record);
			}
		}
		return result;
	}

	@Override
	public List<ActivityRecord> getRecordsForUserAndState(String userUuid, String state) {
		List<ActivityRecord> userRecords = getRecordsForUser(userUuid);
		List<ActivityRecord> result = new ArrayList<>();
		for (ActivityRecord record : userRecords) {
			if (state.equals(record.getState().toString())) {
				result.add(record);
			}
		}
		return result;
	}

	private ActivityRecord createNewRecordFromEntity(ActivityRecordEntity recordEntity) {
		ActivityRecord result = new ActivityRecord();
		result.setDuration((int) recordEntity.getDuration());
		result.setActivityuuid(recordEntity.getActivityUuid());
		result.setState(StateEnum.valueOf(recordEntity.getState()));
		result.setTag(recordEntity.getTag());
		result.startTime(recordEntity.getStartTime());
		result.setEndTime(recordEntity.getEndTime());
		result.setUuid(recordEntity.getUuid());
		return result;
	}

	private ActivityEntity findActivityForRecord(ActivityRecord record) {
		String activityUuid = record.getActivityuuid();
		return activityRepository.findByUuid(activityUuid);
	}

	private Activity createActivityFromEntity(ActivityEntity entity) {
		Activity activity = new Activity();
		activity.setUuid(entity.getUuid());
		activity.setDescription(entity.getDescription());
		activity.setName(entity.getName());
		activity.setOwneruuid(entity.getOwnerUuid());
		activity.setTag(entity.getTag());

		List<ActivityRecordEntity> startedRecord = activityRecordRepository.findAllByActivityUuidAndState(entity.getUuid(), STARTED.toString());
		if (startedRecord.size() == 1) {
			ActivityRecordEntity record = startedRecord.get(0);
			activity.setState(STARTED.toString());
			activity.setDuration((int) (OffsetDateTime.now().toEpochSecond() - record.getStartTime().toEpochSecond()));
		}

		return activity;
	}

	private ActivityEntity createNewEntity(Activity activity) {
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


}
