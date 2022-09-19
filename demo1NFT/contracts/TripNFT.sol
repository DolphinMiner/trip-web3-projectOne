// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TripNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    // tokenId,表示当前nft的id，类似于一个自增主键
    Counters.Counter private tokenIdCounter;

    // 合约构造方法,定义nft的name和symbol
    constructor() ERC721("TripNFT", "Trip") {}

    // onlyOwner修饰表示该方法只能由合约初始化的账户调用
    function safeMint(address to, string memory uri) public onlyOwner {
        // 获取当前的nft的id号
        uint256 tokenId = tokenIdCounter.current();
        // id + 1
        tokenIdCounter.increment();
        // 调用ERC721.sol的_safeMint方法 为to账户分配这个tokenId
        _safeMint(to, tokenId);
        // 调用ERC721URIStorage.sol的_setTokenURI方法，为这个tokenId设置外部存储的uri
        _setTokenURI(tokenId, uri);
    }

    // 下面的burn和tokenURI都是重写接口的方法
    // 销毁nft，取消tokenID与地址的绑定
    function _burn(uint256 tokenId)
    internal
    override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    // 输入一个tokenId，它返回该token元数据所在的URI。
    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // 返回当前的tokenId
    function currentCounter() public view returns (uint256) {
        return tokenIdCounter.current();
    }
    // 由用户自行铸造nft的方法(存在并发的情况，多个用户同时用一个tokenId去铸币，最后只有交易第一个打包的用户成功)
    function freeMint(address to, string memory nftTokenURI) public {
        _safeMint(to, tokenIdCounter.current());
        _setTokenURI(tokenIdCounter.current(), nftTokenURI);
        tokenIdCounter.increment();
    }
}