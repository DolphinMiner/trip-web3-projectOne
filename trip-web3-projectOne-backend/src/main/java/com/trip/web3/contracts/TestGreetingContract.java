package com.trip.web3.contracts;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 5.0.0.
 */
@SuppressWarnings("rawtypes")
public class TestGreetingContract extends Contract {
    public static final String BINARY = "0x60806040526040518060400160405280601381526020017f57656c636f6d6520746f2077656220332e302e000000000000000000000000008152506000908051906020019061004f929190610062565b5034801561005c57600080fd5b50610166565b82805461006e90610134565b90600052602060002090601f01602090048101928261009057600085556100d7565b82601f106100a957805160ff19168380011785556100d7565b828001600101855582156100d7579182015b828111156100d65782518255916020019190600101906100bb565b5b5090506100e491906100e8565b5090565b5b808211156101015760008160009055506001016100e9565b5090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061014c57607f821691505b602082108114156101605761015f610105565b5b50919050565b6103ce806101756000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063a41368621461003b578063cfae321714610057575b600080fd5b6100556004803603810190610050919061022f565b610075565b005b61005f61008b565b60405161006c9190610315565b60405180910390f35b81816000919061008692919061011d565b505050565b60606000805461009a90610366565b80601f01602080910402602001604051908101604052809291908181526020018280546100c690610366565b80156101135780601f106100e857610100808354040283529160200191610113565b820191906000526020600020905b8154815290600101906020018083116100f657829003601f168201915b5050505050905090565b82805461012990610366565b90600052602060002090601f01602090048101928261014b5760008555610192565b82601f1061016457803560ff1916838001178555610192565b82800160010185558215610192579182015b82811115610191578235825591602001919060010190610176565b5b50905061019f91906101a3565b5090565b5b808211156101bc5760008160009055506001016101a4565b5090565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f8401126101ef576101ee6101ca565b5b8235905067ffffffffffffffff81111561020c5761020b6101cf565b5b602083019150836001820283011115610228576102276101d4565b5b9250929050565b60008060208385031215610246576102456101c0565b5b600083013567ffffffffffffffff811115610264576102636101c5565b5b610270858286016101d9565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b60005b838110156102b657808201518184015260208101905061029b565b838111156102c5576000848401525b50505050565b6000601f19601f8301169050919050565b60006102e78261027c565b6102f18185610287565b9350610301818560208601610298565b61030a816102cb565b840191505092915050565b6000602082019050818103600083015261032f81846102dc565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061037e57607f821691505b6020821081141561039257610391610337565b5b5091905056fea2646970667358221220ccd43a0b160de0036de14f0abdc147775baf944fe82b7890b2212f68a7787caa64736f6c634300080a0033";

    public static final String FUNC_GREET = "greet";

    public static final String FUNC_SETGREETING = "setGreeting";

    @Deprecated
    protected TestGreetingContract(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected TestGreetingContract(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected TestGreetingContract(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected TestGreetingContract(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public RemoteFunctionCall<String> greet() {
        final Function function = new Function(FUNC_GREET, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<TransactionReceipt> setGreeting(String _newGreeting) {
        final Function function = new Function(
                FUNC_SETGREETING, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_newGreeting)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static TestGreetingContract load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new TestGreetingContract(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static TestGreetingContract load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new TestGreetingContract(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static TestGreetingContract load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new TestGreetingContract(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static TestGreetingContract load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new TestGreetingContract(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<TestGreetingContract> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(TestGreetingContract.class, web3j, credentials, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<TestGreetingContract> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(TestGreetingContract.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    public static RemoteCall<TestGreetingContract> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(TestGreetingContract.class, web3j, transactionManager, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<TestGreetingContract> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(TestGreetingContract.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }
}
