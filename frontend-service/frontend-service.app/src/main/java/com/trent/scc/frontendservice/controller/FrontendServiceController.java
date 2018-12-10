package com.trent.scc.frontendservice.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.trent.scc.frontendservice.api.UiservicesApi;
import com.trent.scc.frontendservice.api.model.UiService;
import com.trent.scc.frontendservice.api.model.UiServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@EnableDiscoveryClient
@CrossOrigin(origins = "*")
public class FrontendServiceController implements UiservicesApi {

	private static final String BUNDLE_PATH = "/dist/bundle.js";

	private final DiscoveryClient discoveryClient;

	@Autowired
	public FrontendServiceController(DiscoveryClient discoveryClient) {
		this.discoveryClient = discoveryClient;
	}

	@Override
	public ResponseEntity<UiServices> getUiServices() {
		List<String> services = discoveryClient.getServices();
		List<UiService> uiServiceList = new ArrayList<>();
		for (String serviceId : services) {
			List<ServiceInstance> serviceInstances = discoveryClient.getInstances(serviceId);
			ServiceInstance serviceInstance = serviceInstances.get(0);
			Map<String, String> metadata = serviceInstance.getMetadata();
			String hasUi = metadata.getOrDefault("hasUi", "false");

			if (hasUi.isEmpty() || !hasUi.toLowerCase().equals("true")) {
				// No UI provided by this service
				continue;
			}

			String serviceName = metadata.get("serviceName");
			String serviceAddress = "/" + serviceId + BUNDLE_PATH;
			UiService uiService = new UiService().serviceId(serviceId)
					.serviceAddress(serviceAddress)
					.serviceName(serviceName);
			uiServiceList.add(uiService);
		}

		UiServices uiServices = new UiServices().services(uiServiceList);
		return ResponseEntity.ok(uiServices);
	}
}
