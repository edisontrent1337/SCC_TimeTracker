package com.trent.scc.timingservice.controller;

import com.trent.scc.timingservice.api.StatsApi;
import com.trent.scc.timingservice.api.model.OperationResponse;
import com.trent.scc.timingservice.api.model.ServiceStatistic;
import com.trent.scc.timingservice.service.TimingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatisticsController implements StatsApi {

	private final TimingService timingService;

	@Autowired
	public StatisticsController(TimingService timingService) {
		this.timingService = timingService;
	}

	@Override
	public ResponseEntity<OperationResponse> getServiceStatistics() {
		OperationResponse response = new OperationResponse();
		ServiceStatistic serviceStatistic = timingService.getServiceStatistics().getPayload();
		response.addDataItem(serviceStatistic);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
