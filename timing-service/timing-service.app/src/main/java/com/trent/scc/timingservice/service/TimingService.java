package com.trent.scc.timingservice.service;


import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.repository.ActivityEntity;
import com.trent.scc.timingservice.repository.ActivityRecordEntity;
import com.trent.scc.timingservice.repository.ActivityRecordRepository;
import com.trent.scc.timingservice.repository.ActivityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

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
			record.setTime(OffsetDateTime.now());
		}
		ActivityEntity storedActivity = findActivityForRecord(record);
		OperationResult<ActivityRecord> result = new OperationResult<>();
		result.setPayload(record);
		if (storedActivity == null) {
			result.setStatus(NOT_EXISTING);
			return result;
		} else {
			ActivityRecordEntity newRecordEntity = createNewEntityFromRecord(record);
			List<ActivityRecordEntity> storedRecords = activityRecordRepository.findAllByActivityUuid(record.getActivityuuid());
			if (storedRecords.isEmpty()) {
				activityRecordRepository.save(newRecordEntity);
				result.setStatus(SUCCESS);
				return result;
			} else {
				ActivityRecordEntity lastRecordEntity = storedRecords.get(storedRecords.size() - 1);
				if ("STARTED".equals(lastRecordEntity.getState())) {
					lastRecordEntity.setState(ENDED.toString());
					lastRecordEntity.setEndTime(record.getTime());
					long duration = lastRecordEntity.getEndTime().toEpochSecond() - lastRecordEntity.getStartTime().toEpochSecond();
					lastRecordEntity.setDuration(duration);
					activityRecordRepository.save(lastRecordEntity);
					record.setDuration((int) duration);
					result.setPayload(record);

				} else {
					activityRecordRepository.save(newRecordEntity);
				}
				result.setStatus(SUCCESS);
				return result;
			}
		}
	}

	private ActivityRecordEntity createNewEntityFromRecord(ActivityRecord record) {
		ActivityRecordEntity entity = new ActivityRecordEntity();
		entity.setActivityUuid(record.getActivityuuid());
		entity.setState(STARTED.toString());
		entity.setUuid(UUID.randomUUID().toString());
		if (record.getTime() != null) {
			entity.setStartTime(record.getTime());
		} else {
			entity.setStartTime(OffsetDateTime.now());
		}
		return entity;
	}

	@Override
	public OperationStatus removeRecord(String recordUuid) {
		return null;
	}

	@Override
	public ActivityRecord updateRecord(ActivityRecord record) {
		return null;
	}

	@Override
	public OperationStatus deleteRecord(String recordUuid) {
		return null;
	}

	@Override
	public OperationStatus getApplicationStatistics() {
		return null;
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
	public List<ActivityRecord> getAllRecordsForUser(String userUuid) {
		return null;
	}

	private ActivityEntity findActivityForRecord(ActivityRecord record) {
		String activityUuid = record.getActivityuuid();
		return activityRepository.findByUuid(activityUuid);
	}

	private ActivityEntity createNewEntity(Activity activity) {
		ActivityEntity entity = new ActivityEntity();
		entity.setCreationDate(OffsetDateTime.now());
		entity.setModificationDate(OffsetDateTime.now());
		entity.setName(activity.getName());
		entity.setDescription(activity.getDescription());
		entity.setOwnerUuid(activity.getOwneruuid());
		entity.setUuid(UUID.randomUUID().toString());
		return entity;
	}

}
