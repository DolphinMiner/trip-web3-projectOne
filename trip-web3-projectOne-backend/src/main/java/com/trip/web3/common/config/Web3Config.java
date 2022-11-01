package com.trip.web3.common.config;

import com.trip.web3.common.constants.Web3Constants;
import lombok.Builder;
import lombok.Getter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.util.ResourceBundle;

@Configuration
public class Web3Config {

	@Bean(name = "myWeb3j")
	public Web3j buildWeb3j(){
		return Web3j.build(new HttpService(Web3Constants.INFURA_IO_URL + buildWeb3ConfigBase().infuraProjectKey));
	}

	@Bean(name = "myCredentials")
	public Credentials buildCredentials(){
		return Credentials.create(buildWeb3ConfigBase().privateKey);
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
