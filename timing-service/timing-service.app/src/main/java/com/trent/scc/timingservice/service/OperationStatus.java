package com.trent.scc.timingservice.service;

import java.util.ArrayList;
import java.util.List;

public enum OperationStatus {
	SUCCESS,
	DUPLICATE_FAILURE,
	NOT_EXISTING,
	FAILURE,
	UNAUTHORIZED;

	private List<Object> payload = new ArrayList<>();

	public void addPayload(Object object) {
		payload.add(object);
	}
}