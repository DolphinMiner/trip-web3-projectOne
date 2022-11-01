package com.trip.web3.service.impl;

import com.trip.web3.contracts.TestGreetingContract;
import com.trip.web3.service.GreetingService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.tx.gas.DefaultGasProvider;

import javax.annotation.Resource;

@Service
public class GreetingServiceImpl implements GreetingService {
	private static final Logger log = Logger.getLogger(GreetingServiceImpl.class);

	@Resource
	private Web3j myWeb3j;

	@Resource
	private Credentials myCredentials;

	private String contractAddress = "0xE7B68Ff1890c86b7dDAb381ebe5D9909ba17199f";

	@Override
	public String deploy() {
		log.info("Deploying Greeting contract ...");
		TestGreetingContract deploy = null;
		try {
			deploy = TestGreetingContract.deploy(myWeb3j, myCredentials, new DefaultGasProvider()).send();
		} catch (Exception e) {
			log.error("合约部署异常：" + e.getMessage());
			throw new RuntimeException(e);
		}
		log.info("Contract address:" + deploy.getContractAddress());
		contractAddress = deploy.getContractAddress();
		return deploy.getContractAddress();
	}

	@Override
	public String greet() {
		log.info("load Greeting contract ...");
		TestGreetingContract contract =
				TestGreetingContract.load(contractAddress, myWeb3j, myCredentials, new DefaultGasProvider());
		String resultGreet;
		try {
			resultGreet = contract.greet().send();
		} catch (Exception e) {
			log.error("调用合约异常：" + e.getMessage());
			throw new RuntimeException(e);
		}
		return resultGreet;
	}

	@Override
	public void setGreeting(String _newGreeting) {
		log.info("load Greeting contract ...");
		TestGreetingContract contract =
				TestGreetingContract.load(contractAddress, myWeb3j, myCredentials, new DefaultGasProvider());
		try {
			contract.setGreeting(_newGreeting).send();
		} catch (Exception e) {
			log.error("调用合约异常：" + e.getMessage());
			throw new RuntimeException(e);
		}
	}
}
