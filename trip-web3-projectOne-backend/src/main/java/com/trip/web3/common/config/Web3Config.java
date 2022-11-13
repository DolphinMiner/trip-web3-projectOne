package com.trip.web3.common.config;

import com.trip.web3.common.constants.Web3Constants;
import com.trip.web3.contracts.TestGreetingContract;
import com.trip.web3.contracts.TripNFTContract;
import lombok.Builder;
import lombok.Getter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import java.util.ResourceBundle;

@Configuration
public class Web3Config {
	private final String greetContractAddress = "0xE7B68Ff1890c86b7dDAb381ebe5D9909ba17199f";

	@Bean
	public TestGreetingContract loadTestGreetingContract(){
		return TestGreetingContract.load(greetContractAddress, buildWeb3j(), buildCredentials(), new DefaultGasProvider());
	}

	@Bean
	public TripNFTContract loadTripNFTContract(){
		return TripNFTContract.load(buildWeb3ConfigBase().contractAddress,
				buildWeb3j(), buildCredentials(), new DefaultGasProvider());
	}

	public Web3ConfigBase buildWeb3ConfigBase(){
		ResourceBundle bundle = ResourceBundle.getBundle("web3Config");
		return Web3ConfigBase.builder()
				.ownerAddress(bundle.getString("OWNER_ADDRESS"))
				.privateKey(bundle.getString("PRIVATE_KEY"))
				.infuraProjectKey(bundle.getString("INFURA_PROJECT_KEY"))
				.alchemyProjectKey(bundle.getString("ALCHEMY_PROJECT_KEY"))
				.contractAddress(bundle.getString("NFT_CONTRACT_ADDRESS"))
				.build();
	}

	private Web3j buildWeb3j(){
		return Web3j.build(new HttpService(Web3Constants.INFURA_IO_URL + buildWeb3ConfigBase().infuraProjectKey));
	}

	private Credentials buildCredentials(){
		return Credentials.create(buildWeb3ConfigBase().privateKey);
	}


	@Builder
	@Getter
	public static class Web3ConfigBase{
		private String ownerAddress;

		private String privateKey;

		private String contractAddress;

		private String infuraProjectKey;

		private String alchemyProjectKey;
	}

}
