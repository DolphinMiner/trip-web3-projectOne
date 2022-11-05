package com.trip.web3.service.impl;

import com.trip.web3.common.annotation.LogCollection;
import com.trip.web3.common.config.Web3Config;
import com.trip.web3.common.constants.Web3Constants;
import com.trip.web3.contracts.TestGreetingContract;
import com.trip.web3.service.GreetingService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import javax.annotation.Resource;

@Service
public class GreetingServiceImpl implements GreetingService {
	private static final Logger log = Logger.getLogger(GreetingServiceImpl.class);

	@Resource
	private TestGreetingContract testGreetingContract;

	@Resource
	private Web3Config web3Config;

	@Override
	public String deploy() {
		log.info("Deploying Greeting contract ...");
		Web3j web3j =
				Web3j.build(new HttpService(Web3Constants.INFURA_IO_URL + web3Config.buildWeb3ConfigBase().getInfuraProjectKey()));
		Credentials credentials = Credentials.create(web3Config.buildWeb3ConfigBase().getPrivateKey());
		TestGreetingContract deploy = null;
		try {
			deploy = TestGreetingContract.deploy(web3j, credentials, new DefaultGasProvider()).send();
		} catch (Exception e) {
			log.error("合约部署异常：" + e.getMessage());
			throw new RuntimeException(e);
		}
		log.info("Contract address:" + deploy.getContractAddress());
		return deploy.getContractAddress();
	}

	@LogCollection
	@Override
	public String greet() {
		log.info("load Greeting contract ...");
		String resultGreet;
		try {
			resultGreet = testGreetingContract.greet().send();
		} catch (Exception e) {
			log.error("调用合约异常：" + e.getMessage());
			throw new RuntimeException(e);
		}
		return resultGreet;
	}

	@LogCollection
	@Override
	public void setGreeting(String _newGreeting) {
		log.info("load Greeting contract ...");
		try {
			testGreetingContract.setGreeting(_newGreeting).send();
		} catch (Exception e) {
			log.error("调用合约异常：" + e.getMessage());
			throw new RuntimeException(e);
		}
	}
}
