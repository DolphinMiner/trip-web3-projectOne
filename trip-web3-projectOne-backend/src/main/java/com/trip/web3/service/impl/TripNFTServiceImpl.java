package com.trip.web3.service.impl;

import com.trip.web3.common.config.Web3Config;
import com.trip.web3.contracts.TripNFTContract;
import com.trip.web3.service.TripNFTService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.tx.gas.DefaultGasProvider;

import javax.annotation.Resource;
import java.math.BigInteger;
import java.util.List;

@Service
public class TripNFTServiceImpl implements TripNFTService {

	private static final Logger log = Logger.getLogger(TripNFTServiceImpl.class);

	@Resource
	private Web3j myWeb3j;

	@Resource
	private Credentials myCredentials;

	@Resource
	Web3Config web3Config;

	/**
	 * 获取合约名称
	 *
	 * @return
	 */
	@Override
	public String getContractName() {
		try {
			return loadTripNFTContract().name().send();
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
		TripNFTContract send = null;
		try {
			send = TripNFTContract.deploy(myWeb3j, myCredentials, new DefaultGasProvider()).send();
		} catch (Exception e) {
			log.error("合约部署异常：" + e.getMessage());
			throw new RuntimeException(e);
		}
		log.info("Contract address:" + send.getContractAddress());
		return send.getContractAddress();
	}

	public void isValidUser(List<byte[]> merkleProof){
		loadTripNFTContract().isValidUser(merkleProof);
	}

	public void preMint(BigInteger numberOfTokens, List<byte[]> merkleProof) {
		loadTripNFTContract().preMint(numberOfTokens, merkleProof);
	}

	public void publicMint(BigInteger numberOfTokens) {
		loadTripNFTContract().publicMint(numberOfTokens);
	}

	public void tokenURI(BigInteger tokenId){
		loadTripNFTContract().tokenURI(tokenId);
	}

	public void reserveNFT(){
		loadTripNFTContract().reserveNFT();
	}

	public void reserveSpecialNFT(){
		loadTripNFTContract().reserveSpecialNFT();
	}

	public void withdrawMoney(String to){
		loadTripNFTContract().withdrawMoney(to);
	}

	public void _setTokenURI(){

	}

	public void _baseURI(){
	}

	public void flipSaleActive(){
		loadTripNFTContract().flipSaleActive();
	}

	public void flipReveal(){
		loadTripNFTContract().flipReveal();
	}

	public void setMintPrice(BigInteger _mintPrice){
		loadTripNFTContract().setMintPrice(_mintPrice);
	}

	public void setNotRevealedURI(String _unrevealedURI){
		loadTripNFTContract().setNotRevealedURI(_unrevealedURI);
	}

	public void setBaseURI(String _newBaseURI){
		loadTripNFTContract().setBaseURI(_newBaseURI);
	}

	public void setBaseExtension(String _newBaseExtension){
		loadTripNFTContract().setBaseExtension(_newBaseExtension);
	}

	public void setMaxBalance(BigInteger _maxBalance){
		loadTripNFTContract().setMaxBalance(_maxBalance);
	}

	public void setMaxMint(BigInteger _maxMint){
		loadTripNFTContract().setMaxMint(_maxMint);
	}

	public void setRootHash(byte[] _merkleRootHash){
		loadTripNFTContract().setRootHash(_merkleRootHash);
	}

	public void setSaleStage(BigInteger _stage){
		loadTripNFTContract().setSaleStage(_stage);
	}

	private TripNFTContract loadTripNFTContract(){
		return TripNFTContract.load(
				web3Config.buildWeb3ConfigBase().getContractAddress(),
				myWeb3j,
				myCredentials,
				new DefaultGasProvider());
	}
}
