package com.trent.scc.timingservice.service;


import com.trent.scc.timingservice.api.model.Achievement;
import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.api.model.ServiceStatistic;
import com.trent.scc.timingservice.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
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
			ActivityEntity entity = EntityCreator.activityEntity(activity);
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
		if (storedActivity == null) {
			result.setStatus(NOT_EXISTING);
			return result;
		} else {
			ActivityRecordEntity newRecordEntity = EntityCreator.recordEntity(record);
			newRecordEntity.setTag(storedActivity.getTag());
			List<ActivityRecordEntity> storedRecords = activityRecordRepository.findAllByActivityUuid(record.getActivityuuid());
			String activityName = storedActivity.getName();
			if (storedRecords.isEmpty()) {
				activityRecordRepository.save(newRecordEntity);
				record = EntityCreator.toRecord(newRecordEntity);
			} else {
				ActivityRecordEntity lastRecordEntity = storedRecords.get(storedRecords.size() - 1);
				if ("STARTED".equals(lastRecordEntity.getState())) {
					lastRecordEntity.setState(ENDED.toString());
					lastRecordEntity.setEndTime(record.getTime());
					long duration = lastRecordEntity.getEndTime().toEpochSecond() - lastRecordEntity.getStartTime().toEpochSecond();
					lastRecordEntity.setDuration(duration);
					activityRecordRepository.save(lastRecordEntity);
					record = EntityCreator.toRecord(lastRecordEntity);
				} else {
					activityRecordRepository.save(newRecordEntity);
					record = EntityCreator.toRecord(newRecordEntity);
				}
			}
			record.setActivityName(activityName);
			result.setStatus(SUCCESS);
			result.setPayload(record);
			return result;
		}
	}

	@Override
	public OperationResult<ActivityRecord> removeRecord(String recordUuid) {
		OperationResult<ActivityRecord> result = new OperationResult<>();
		ActivityRecordEntity recordEntity = activityRecordRepository.findByUuid(recordUuid);
		if (recordEntity != null) {
			activityRecordRepository.delete(recordEntity);
			result.setStatus(SUCCESS);
			result.setPayload(EntityCreator.toRecord(recordEntity));
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
			Activity activity = EntityCreator.toActivity(entity, activityRecordRepository);
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
			Activity activity = EntityCreator.toActivity(entity, activityRecordRepository);
			result.add(activity);
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
				ActivityRecord record = EntityCreator.toRecord(recordEntity);
				record.setActivityName(activityEntity.getName());
				result.add(record);
			}
		}
		result.sort(Comparator.comparing(ActivityRecord::getStartTime));
		for (ActivityRecord record : result) {
			LOGGER.info(record.getActivityName());
		}
		return result;
	}

	@Override
	public List<ActivityRecord> getRecordsForTag(String tag) {
		List<ActivityRecord> result = new ArrayList<>();
		List<ActivityRecordEntity> recordEntities = activityRecordRepository.findAllByTag(tag);
		for (ActivityRecordEntity recordEntity : recordEntities) {
			result.add(EntityCreator.toRecord(recordEntity));
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
				result.add(EntityCreator.toRecord(recordEntity));
			}
		}
		return result;
	}

	@Override
	public List<ActivityRecord> getRecordsForUserAndDay(String userUuid, OffsetDateTime day) {
		List<ActivityRecord> recordsForUser = getRecordsForUser(userUuid);
		List<ActivityRecord> result = new ArrayList<>();
		for (ActivityRecord record : recordsForUser) {
			System.out.println(record);
			@Valid OffsetDateTime startTime = record.getStartTime();
			@Valid OffsetDateTime endTime = record.getEndTime();
			int startDay = startTime.getDayOfYear();
			int endDay = endTime.getDayOfYear();

			if (startDay == day.getDayOfYear() && endDay == day.getDayOfYear()) {
				result.add(record);
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


	@Override
	public OperationResult<ServiceStatistic> getServiceStatistics() {
		OperationResult<ServiceStatistic> result = new OperationResult<>();
		ServiceStatistic serviceStatistic = new ServiceStatistic();
		serviceStatistic.setTotalTrackedRecords((int) activityRecordRepository.count());
		serviceStatistic.setTotalCreatedActivities((int) activityRepository.count());
		Map<String, Integer> tagTimes = new HashMap<>();
		Set<String> userUUIDs = new HashSet<>();
		for (ActivityEntity activityEntity : activityRepository.findAll()) {
			if (!tagTimes.containsKey(activityEntity.getTag())) {
				tagTimes.put(activityEntity.getTag(), 0);
			}
			userUUIDs.add(activityEntity.getOwnerUuid());
		}
		serviceStatistic.setTimeTrackingUsers(userUUIDs.size());
		String mostTrackedTag = null;
		String mostActiveUserUUID = null;
		int mostTrackedTagTime = 0;
		for (ActivityRecordEntity recordEntity : activityRecordRepository.findAll()) {
			if (recordEntity.getState().equals(STARTED.toString())) {
				continue;
			}
			String recordTag = recordEntity.getTag();
			if (tagTimes.containsKey(recordTag)) {
				int accumulatedTime = tagTimes.get(recordTag);
				accumulatedTime += recordEntity.getDuration();
				tagTimes.put(recordTag, accumulatedTime);
				if (accumulatedTime > mostTrackedTagTime) {
					mostTrackedTagTime = accumulatedTime;
					mostTrackedTag = recordTag;
					mostActiveUserUUID = activityRepository.findByUuid(recordEntity.getActivityUuid()).getOwnerUuid();
				}
			}
		}

		serviceStatistic.setMostTrackedTag(mostTrackedTag);
		serviceStatistic.setMostTrackedTagTime(mostTrackedTagTime);
		serviceStatistic.setMostActiveUserUUID(mostActiveUserUUID);

		List<ActivityEntity> activitiesForMostActiveUser = activityRepository.findAllByOwnerUuid(mostActiveUserUUID);
		Set<ActivityRecordEntity> recordsForMostActiveUser = new HashSet<>();
		for (ActivityEntity activityEntity : activitiesForMostActiveUser) {
			String activityUUID = activityEntity.getUuid();
			recordsForMostActiveUser.addAll(activityRecordRepository.findAllByActivityUuid(activityUUID));
		}
		int durationForMostActiveUser = 0;
		for (ActivityRecordEntity recordEntity : recordsForMostActiveUser) {
			if (recordEntity.getState().equals(ENDED.toString())) {
				durationForMostActiveUser += recordEntity.getDuration();
			}
		}
		serviceStatistic.setTimeForUserWithMostTrackedTime(durationForMostActiveUser);
		result.setStatus(SUCCESS);
		result.setPayload(serviceStatistic);
		return result;
	}

	@Override
	public OperationResult<Achievement> createAchievement(Achievement achievement) {
		return null;
	}

	@Override
	public OperationResult<Achievement> updateAchievement(Achievement achievement) {
		return null;
	}

	@Override
	public OperationResult<Achievement> getAchievement(String achievementUuid) {
		return null;
	}

	@Override
	public OperationResult<List<Achievement>> getAchievements() {
		return null;
	}


	private ActivityEntity findActivityForRecord(ActivityRecord record) {
		String activityUuid = record.getActivityuuid();
		return activityRepository.findByUuid(activityUuid);
	}
}
