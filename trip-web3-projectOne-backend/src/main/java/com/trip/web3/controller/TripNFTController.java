package com.trip.web3.controller;

import com.trip.web3.service.TripNFTService;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RequestMapping("v1/nft")
@RestController
public class TripNFTController {
	private static final Logger log = Logger.getLogger(TripNFTController.class);

	@Resource
	TripNFTService tripNFTService;

	@GetMapping("/deploy")
	public String deploy(){
		log.info("TripNFTController =======  Deploy~~");
		return tripNFTService.deploy();
	}

	@GetMapping("/name")
	public String getContractName() {
		log.info("TripNFTController =======  getContractName~~");
		return tripNFTService.getContractName();
	}

}
