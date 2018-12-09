package com.trent.scc.timingservice.service;

import com.trent.scc.timingservice.TimingServiceApp;
import com.trent.scc.timingservice.api.model.Activity;
import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.repository.ActivityEntity;
import com.trent.scc.timingservice.repository.ActivityRecordEntity;
import com.trent.scc.timingservice.repository.ActivityRecordRepository;
import com.trent.scc.timingservice.repository.ActivityRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.OffsetDateTime;
import java.util.UUID;

import static com.trent.scc.timingservice.api.model.ActivityRecord.StateEnum.ENDED;
import static com.trent.scc.timingservice.api.model.ActivityRecord.StateEnum.STARTED;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TimingServiceApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class TimingServiceTest {

	@Autowired
	private TimingService timingService;

	@Autowired
	private ActivityRepository activityRepository;

	@Autowired
	private ActivityRecordRepository activityRecordRepository;

	@Before
	public void cleanUp() {
		activityRecordRepository.deleteAll();
		activityRepository.deleteAll();
	}


	@Test
	public void createActivityWorksCorrectly() {
		String activityName = "Sleeping";
		String activityDescription = "Usually done late at night";

		Activity activity = createActivity(activityName, activityDescription);
		OperationStatus status = timingService.addActivity(activity);
		assertEquals("The operation status is wrong.", OperationStatus.SUCCESS, status);
		assertEquals("The number of saved activities is wrong", 1, activityRepository.count());

		status = timingService.addActivity(activity);
		assertEquals("The service should throw a duplicate error", OperationStatus.DUPLICATE_FAILURE, status);

		ActivityEntity entity = activityRepository.findByNameAndOwnerUuid(activityName, activity.getOwneruuid());
		assertEquals("The saved name was wrong", activityName, entity.getName());
		assertEquals("The saved description was wrong", activityDescription, entity.getDescription());
		assertNotNull("The uuid of the activity was null.", entity.getUuid());
		assertNotNull("The owner uuid of the activity was null.", entity.getOwnerUuid());

	}

	@Test
	public void addActivityRecordWorksCorrectly() {
		String activityName = "Studying";
		Activity activity = createActivity(activityName, "Done because we have to");
		timingService.addActivity(activity);

		ActivityRecord record = createActivityRecord(activity);
		String activityUuid = record.getActivityuuid();

		int expectedTotalRecords = 0;
		for (int i = 0; i < 4; i++) {
			record.setTime(OffsetDateTime.now().plusMinutes(i));
			assertAddRecord(record);
			if (i % 2 == 0) {
				assertLatestRecordState(STARTED, activityUuid);
			} else {
				assertLatestRecordState(ENDED, activityUuid);
				expectedTotalRecords++;
				assertTotalNumberOfRecords(expectedTotalRecords);
				assertLatestRecordDuration(activityUuid,60);
			}
		}
		assertTotalNumberOfRecords(2);
		assertNumberOfRecordsFor(activityUuid, 2);
		assertTotalDurationForActivity(activityUuid, 120);


		Activity otherActivity = createActivity("Working", "Done because we have to");
		timingService.addActivity(otherActivity);

		ActivityRecord otherRecord = createActivityRecord(otherActivity);
		assertAddRecord(otherRecord);
		assertTotalNumberOfRecords(3);
		String otherActivityUuid = otherRecord.getActivityuuid();
		assertLatestRecordState(STARTED, otherActivityUuid);

		assertNumberOfRecordsFor(otherActivityUuid, 1);

		assertTotalDurationForActivity(otherActivityUuid, 0);

		otherRecord.setTime(OffsetDateTime.now().plusMinutes(3));
		assertAddRecord(otherRecord);
		assertTotalDurationForActivity(otherActivityUuid, 180);

	}

	private void assertNumberOfRecordsFor(String activityUuid, int expectedLength) {
		int count = activityRecordRepository.findAllByActivityUuid(activityUuid).size();
		assertEquals("The number of records for " + activityUuid + " was wrong.", expectedLength, count);
	}

	private void assertTotalDurationForActivity(String activityUuid, long expectedDuration) {
		long duration = timingService.getTotalDurationOfActivity(activityUuid);
		assertEquals("The total duration for " + activityUuid + " was wrong.", expectedDuration, duration);
	}

	private void assertTotalNumberOfRecords(int expectedLength) {
		long count = activityRecordRepository.count();
		assertEquals("The total number of saved records is wrong.", expectedLength, count);
	}

	private void assertLatestRecordState(ActivityRecord.StateEnum state, String activityUuid) {
		ActivityRecordEntity latestRecord;
		try {
			latestRecord = timingService.getLatestRecordForActivity(activityUuid);
			assertEquals("The last saved record did not have the correct state.", state.toString(), latestRecord.getState());
			assertNotNull("The activity UUID was not set.", latestRecord.getActivityUuid());
		} catch (NoSuchElementException e) {
			e.printStackTrace();
		}
	}

	private void assertLatestRecordDuration(String activityUuid, long expectedDuration) {
		ActivityRecordEntity latestRecord;
		try {
			latestRecord = timingService.getLatestRecordForActivity(activityUuid);
			assertEquals("The record did not contain the right amount of time.", expectedDuration, latestRecord.getDuration());
		} catch (NoSuchElementException e) {
			e.printStackTrace();
		}
	}

	private void assertAddRecord(ActivityRecord record) {
		OperationStatus status = timingService.addRecord(record);
		assertEquals("There was an error creating a record for an activity.", OperationStatus.SUCCESS, status);
	}

	private ActivityRecord createActivityRecord(Activity activity) {
		ActivityEntity entity = activityRepository.findByNameAndOwnerUuid(activity.getName(), activity.getOwneruuid());
		String activityUuid = entity.getUuid();
		ActivityRecord record = new ActivityRecord();
		record.setActivityuuid(activityUuid);
		record.setTime(OffsetDateTime.now());
		return record;
	}

	private Activity createActivity(String name, String description) {
		Activity activity = new Activity();
		activity.setName(name);
		activity.description(description);
		activity.setOwneruuid(UUID.nameUUIDFromBytes(name.getBytes()).toString());
		return activity;
	}
}