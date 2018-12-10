package com.trent.scc.timingservice.service;

public class OperationResult<T> {
	private T payload;
	private OperationStatus status;

	public OperationResult() {
	}

	public OperationResult(T object) {
		this.payload = object;
	}

	public OperationResult(T object, OperationStatus operationStatus) {
		this.payload = object;
		this.status = operationStatus;
	}

	public T getPayload() {
		return payload;
	}

	public void setPayload(T payload) {
		this.payload = payload;
	}

	public OperationStatus getStatus() {
		return status;
	}

	public void setStatus(OperationStatus status) {
		this.status = status;
	}
}
