package com.trip.web3.utils;

import cn.hutool.core.io.file.FileReader;
import cn.hutool.json.JSONObject;
import org.junit.Test;
import org.web3j.codegen.SolidityFunctionWrapperGenerator;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.stream.Stream;

/**
 * Solidity生成Java文件
 */
public class SolidityToJavaGenerator {

	@Test
	public void generate() {
		genJavaFile("TestGreeting");
	}

	public void genJavaFile(String contractName){
		// 解析contracts，获取abi & bin
		FileReader fileReader = new FileReader(String.format("./contracts/%s.json", contractName));
		JSONObject contractJsonObj = new JSONObject(fileReader.readString());
		String abiJsonStr = contractJsonObj.getStr("abi");
		String bytecodeJsonStr = contractJsonObj.getStr("bytecode");

		// 创建abi & bin文件
		File abiFile = new File(String.format("./src/main/resources/contracts/%s.abi", contractName));
		File binFile = new File(String.format("./src/main/resources/contracts/%s.bin", contractName));
		writeAbiAndBin(abiJsonStr, bytecodeJsonStr, abiFile, binFile);

		// 根据abi & bin文件生成Java文件
		generateJavaFile(abiFile.getPath(), binFile.getPath(), contractName);

		// 删除abi & bin文件
		removeAbiAndBin(abiFile, binFile);
	}

	/**
	 * 写入abi & bin文件
	 * @param abi
	 * @param bin
	 * @param abiFile
	 * @param binFile
	 */
	private void writeAbiAndBin(String abi, String bin, File abiFile, File binFile){
		BufferedOutputStream abiBos = null;
		BufferedOutputStream binBos = null;
		try{
			FileOutputStream abiFos = new FileOutputStream(abiFile);
			FileOutputStream binFos = new FileOutputStream(binFile);
			abiBos = new BufferedOutputStream(abiFos);
			binBos = new BufferedOutputStream(binFos);
			abiBos.write(abi.getBytes());
			abiBos.flush();
			binBos.write(bin.getBytes());
			binBos.flush();
		}catch (Exception e){
			e.printStackTrace();
		}finally {
			if(abiBos != null){
				try{
					abiBos.close();
				}catch (IOException e){
					e.printStackTrace();
				}
			}
			if(binBos != null){
				try {
					binBos.close();
				}catch (IOException e){
					e.printStackTrace();
				}
			}
		}
	}

	/**
	 * 生成java文件
	 * @param abiFile
	 * @param binFile
	 * @param contractName
	 */
	private void generateJavaFile(String abiFile, String binFile, String contractName){
		String generateFilePath = "./src/main/java/";
		String javaFileName = contractName + "Contract";
		String basePackageName = "com.trip.web3.contracts";
		String[] args = Arrays.asList(
				"-a", abiFile,
				"-b", binFile,
				"-p", basePackageName,    // base package name
				"-c", javaFileName,    // contract name (defaults to ABI file name)
				"-o", generateFilePath
		).toArray(new String[0]);
		Stream.of(args).forEach(System.out::println);

		SolidityFunctionWrapperGenerator.main(args);
	}

	/**
	 * 移除abi & bin文件
	 * @param abiFile
	 * @param binFile
	 */
	private void removeAbiAndBin(File abiFile, File binFile){
		if(abiFile.delete())
			System.out.println("Successfully delete the ABI file.");
		if(binFile.delete())
			System.out.println("Successfully delete the BIN file.");
	}

}
