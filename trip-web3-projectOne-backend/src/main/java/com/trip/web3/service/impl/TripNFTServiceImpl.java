package com.trip.web3.service.impl;

import com.trip.web3.common.config.Web3Config;
import com.trip.web3.common.constants.Web3Constants;
import com.trip.web3.contracts.TripNFTContract;
import com.trip.web3.service.TripNFTService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import javax.annotation.Resource;
import java.math.BigInteger;
import java.util.List;

@Service
public class TripNFTServiceImpl implements TripNFTService {

	private static final Logger log = Logger.getLogger(TripNFTServiceImpl.class);

	@Resource
	private TripNFTContract tripNFTContract;
	@Resource
	private Web3Config web3Config;


	/**
	 * 获取合约名称
	 *
	 * @return
	 */
	@Override
	public String getContractName() {
		try {
			return tripNFTContract.name().send();
		} catch (Exception e) {
			log.error("获取合约名称异常：" + e.getMessage());
			throw new RuntimeException(e);
		}
	}

	/**
	 * 合约部署 ***慎用***
	 * @return
	 */
	@Override
	public String deploy() {
		log.info("Deploying TripNFTContract contract ...");
		Web3j web3j =
				Web3j.build(new HttpService(Web3Constants.INFURA_IO_URL + web3Config.buildWeb3ConfigBase().getInfuraProjectKey()));
		Credentials credentials = Credentials.create(web3Config.buildWeb3ConfigBase().getPrivateKey());
		TripNFTContract send = null;
		try {
			send = TripNFTContract.deploy(web3j, credentials, new DefaultGasProvider()).send();
		} catch (Exception e) {
			log.error("合约部署异常：" + e.getMessage());
			throw new RuntimeException(e);
		}
		log.info("Contract address:" + send.getContractAddress());
		return send.getContractAddress();
	}

	public void isValidUser(List<byte[]> merkleProof){
		tripNFTContract.isValidUser(merkleProof);
	}

	public void preMint(BigInteger numberOfTokens, List<byte[]> merkleProof) {
		tripNFTContract.preMint(numberOfTokens, merkleProof);
	}

	public void publicMint(BigInteger numberOfTokens) {
		tripNFTContract.publicMint(numberOfTokens);
	}

	public void tokenURI(BigInteger tokenId){
		tripNFTContract.tokenURI(tokenId);
	}

	public void reserveNFT(){
		tripNFTContract.reserveNFT();
	}

	public void reserveSpecialNFT(){
		tripNFTContract.reserveSpecialNFT();
	}

	public void withdrawMoney(String to){
		tripNFTContract.withdrawMoney(to);
	}

	public void _setTokenURI(){

	}

	public void _baseURI(){
	}

	public void flipSaleActive(){
		tripNFTContract.flipSaleActive();
	}

	public void flipReveal(){
		tripNFTContract.flipReveal();
	}

	public void setMintPrice(BigInteger _mintPrice){
		tripNFTContract.setMintPrice(_mintPrice);
	}

	public void setNotRevealedURI(String _unrevealedURI){
		tripNFTContract.setNotRevealedURI(_unrevealedURI);
	}

	public void setBaseURI(String _newBaseURI){
		tripNFTContract.setBaseURI(_newBaseURI);
	}

	public void setBaseExtension(String _newBaseExtension){
		tripNFTContract.setBaseExtension(_newBaseExtension);
	}

	public void setMaxBalance(BigInteger _maxBalance){
		tripNFTContract.setMaxBalance(_maxBalance);
	}

	public void setMaxMint(BigInteger _maxMint){
		tripNFTContract.setMaxMint(_maxMint);
	}

	public void setRootHash(byte[] _merkleRootHash){
		tripNFTContract.setRootHash(_merkleRootHash);
	}

	public void setSaleStage(BigInteger _stage){
		tripNFTContract.setSaleStage(_stage);
	}

}
