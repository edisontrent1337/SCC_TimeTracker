package com.trent.scc.timingservice.controller;

import com.trent.scc.timingservice.api.model.ActivityRecord;
import com.trent.scc.timingservice.jwt.JWTConstants;
import com.trent.scc.timingservice.repository.ActivityRecordRepository;
import com.trent.scc.timingservice.repository.ActivityRepository;
import com.trent.scc.timingservice.support.TestConstants;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.time.OffsetDateTime;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class TimingServiceControllerTest {

	@Autowired
	private TestRestTemplate restTemplate;

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
	public void addActivityWorksCorrectly() {
		HttpEntity<String> entity = createHttpEntityForActivity("Working", "At a company");
		assertAddActivity(entity);
	}

	@Test
	public void addRecordWorksCorrectly() {
		HttpEntity<String> httpEntityForActivity = createHttpEntityForActivity("Working", "At a company");
		JSONObject response = assertAddActivity(httpEntityForActivity);
		try {
			JSONArray array = response.getJSONArray("data");
			JSONObject data = new JSONObject(array.get(0).toString());
			String activityUuid = activityRepository.findByNameAndOwnerUuid("Working", data.get("owneruuid").toString()).getUuid();
			HttpEntity<String> httpEntityForRecord = createHttpEntityForRecord(activityUuid, OffsetDateTime.now(), ActivityRecord.StateEnum.STARTED);
			assertAddRecord(httpEntityForRecord, activityUuid);
		} catch (JSONException e) {
			e.printStackTrace();
		}

	}

	private HttpEntity<String> createHttpEntityForActivity(String name, String description) {
		HttpHeaders headers = createAuthorizedHeaders();
		String body = getActivityAsJson(name, description).toString();
		return new HttpEntity<>(body, headers);
	}

	private JSONObject assertAddActivity(HttpEntity<String> entity) {
		String path = "/activities/";
		ResponseEntity<String> response = restTemplate.exchange(path, HttpMethod.POST, entity, String.class);
		assertEquals("The status code was wrong for " + path + HttpMethod.POST, HttpStatus.OK, response.getStatusCode());
		JSONObject responseJSON = getResponseAsJSON(response);
		try {
			assertEquals("No error should be thrown when adding a record", responseJSON.getString("error"), "null");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return responseJSON;
	}

	private void assertAddRecord(HttpEntity<String> entity, String activityUuid) throws JSONException {
		String path = "/activities/" + activityUuid + "/records";
		ResponseEntity<String> response = restTemplate.exchange(path, HttpMethod.POST, entity, String.class);
		assertEquals("The status code was wrong for " + path + HttpMethod.POST, HttpStatus.OK, response.getStatusCode());
		JSONObject responseJSON = getResponseAsJSON(response);
		assertEquals("No error should be thrown when adding a record", responseJSON.getString("error"), "null");
	}

	private HttpEntity<String> createHttpEntityForRecord(String activityUuid, OffsetDateTime time, ActivityRecord.StateEnum state) {
		HttpHeaders headers = createAuthorizedHeaders();
		String body = getRecordAsJson(activityUuid, time, state).toString();
		return new HttpEntity<>(body, headers);
	}

	private JSONObject getResponseAsJSON(ResponseEntity<String> response) {
		String responseBody = response.getBody();
		assertNotNull("The response body should not be empty", responseBody);
		JSONObject responseJSON = null;
		try {
			responseJSON = new JSONObject(responseBody);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return responseJSON;
	}

	private JSONObject getRecordAsJson(String activityUuid, OffsetDateTime time, ActivityRecord.StateEnum state) {
		JSONObject jsonObject = new JSONObject();
		try {
			jsonObject.put("activityuuid", activityUuid);
			jsonObject.put("time", time.toString());
			jsonObject.put("state", state);
		} catch (JSONException ex) {
			ex.printStackTrace();
		}
		return jsonObject;
	}

	private JSONObject getActivityAsJson(String name, String description) {
		JSONObject jsonObject = new JSONObject();
		try {
			jsonObject.put("name", name);
			jsonObject.put("description", description);
		} catch (JSONException ex) {
			ex.printStackTrace();
		}
		return jsonObject;
	}

	private HttpHeaders createAuthorizedHeaders() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set(JWTConstants.AUTHORIZATION, TestConstants.TEST_JWT_TOKEN);
		return headers;
	}
}