// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract TripNFT is Ownable, ERC721Enumerable {
    using Strings for uint256;

    // 是否准许nft开卖-开关
    bool public _isSaleActive = true;

    // 初始化盲盒，等到一定时机可以随机开箱，变成true
    bool public _revealed = false;

    // nft的总数量
    uint256 public constant MAX_SUPPLY = 50;

    // 铸造Nft的价格
    uint256 public mintPrice = 0 ether;

    // 铸造的钱包最多只能有5个nft数量
    uint256 public maxBalance = 5;

    // 一次mint的nft的数量
    uint256 public maxMint = 1;

    // 盲盒开关打开后，需要显示开箱的图片的base地址，如ipfs://ashijfpsdafa/(1.png,2.png,3.png)根据tokenID定位盲盒
    string public baseURI = "";

    // 盲盒图片的meta,json地址
    string public notRevealedUri="ipfs://QmRzUk7SgUgU928GkYFe5yerLQzVke1AVx9jhimAziBcAU";

    // 默认地址的扩展类型
    string public baseExtension = ".json";


    // map tokenId 与 tokenURI的映射
    mapping(uint256 => string) private _tokenURIs;

    // 散列数组的范围 这里定义为[0,100]
    // [1,20] 返回 1    20概率
    // [21,40] 返回 2   20概率
    // [41,55] 返回 3   15概率
    // [56,65] 返回 4   10概率
    // [66,75] 返回 5   10概率
    // [76,85] 返回 6   10概率
    // [86,95] 返回 7   10概率
    // [96,100] 返回 8   5概率
    uint public Hash_Array = 100;

    // 构造器
    constructor()
    ERC721("TripMagicNFT", "TMN") {}// 实现了ERC721的父类构造器，是子类继承的一种实现方式

    // 外部地址进行铸造nft的函数调用
    function mintNft(uint256 tokenQuantity, address recipient) public payable {
        // 校验总供应量+每次铸造的数量<= nft的总数量
        require(
            totalSupply() + tokenQuantity <= MAX_SUPPLY,
            "Sale would exceed max supply"
        );
        // 校验是否开启开卖状态
        require(_isSaleActive, "Sale must be active to mint NicMetas");
        // 校验铸造的钱包地址中的nft的数量 + 本次铸造的数量 <= 该钱包最大拥有的nft的数量
        require(
        // balanceOf(msg.sender) 查看调用合约账户拥有的nft数量
        // 限制每个用户拥有的nft数量不能超过设定值
            balanceOf(msg.sender) + tokenQuantity <= maxBalance,
            "Sale would exceed max balance"
        );
        // 校验本次铸造的数量*铸造的价格 <= 本次消息附带的eth的数量
        // 校验用户是否有足够金额支付nft价格
        require(
            tokenQuantity * mintPrice <= msg.value,
            "Not enough ether sent"
        );
        // 校验本次铸造的数量 <= 本次铸造的最大数量
        require(tokenQuantity <= maxMint, "Can only mint 1 tokens at a time");
        // 以上校验条件满足，进行nft的铸造
        // 调用铸造方法
        _mintNftMeta(tokenQuantity, recipient);
    }

    // 根据nonce生成对应数字映射 0～8
    function getIndexFromNonce(uint256 nonce) private pure returns (uint256) {
        if (nonce == 0) return 0;
        if (nonce >= 1 && nonce <= 20) return 1;
        if (nonce >= 21 && nonce <= 40) return 2;
        if (nonce >= 41 && nonce <= 55) return 3;
        if (nonce >= 56 && nonce <= 65) return 4;
        if (nonce >= 66 && nonce <= 75) return 5;
        if (nonce >= 76 && nonce <= 85) return 6;
        if (nonce >= 86 && nonce <= 95) return 7;
        return 8;
    }

    // 生成目标URI
    function getURIFromIndex(uint256 index) private pure returns (string memory) {
        string memory uri = index == 0
            ? "ipfs://Qme8ZKMgMLPYyra51gChJn4HxgpWm8oeKFV2NPjGtBd1pz"
            : string(
                abi.encodePacked(
                    "ipfs://QmTKySihsR9BRUzsfWXKt3LeMCb1BSxpLQjndJLhiEe8pk/",
                    index.toString(),
                    ".json"
                )
            );
        return uri;
    }

    // 进行铸造
    function _mintNftMeta(uint256 tokenQuantity, address recipient) internal {
        for (uint256 i = 0; i < tokenQuantity; i++) {

            if (totalSupply() < MAX_SUPPLY) {

                //  mintIndex是铸造nft的序号，按照总供应量从0开始累加
                uint256 tokenId = totalSupply();

                // 计算概率，随机数生成
                uint256 nonce = uint256(
                    keccak256(abi.encodePacked(msg.sender, block.timestamp))
                ) % Hash_Array;

                // 获取随机数映射的值，范围0～8
                uint256 indexFromNonce = getIndexFromNonce(nonce);

                // 根据映射的值设置对应的URI
                _tokenURIs[tokenId] = getURIFromIndex(indexFromNonce);

                // 调用ERC721.sol的_safeMint方法 为recipient账户分配这个tokenId
                _safeMint(recipient, tokenId);
            }
        }
    }

    // 返回每个nft地址的Uri，这里包含了nft的整个信息，包括名字，描述，属性等
    // OpenSea等交易市场就是通过这个接口实现获取到token的URI
    function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        // 盲盒还没开启，那么默认是一张黑色背景图片或者其他图片
        if (_revealed == false) {
            return notRevealedUri;
        }

        string memory tokenUri = _tokenURIs[tokenId];
        // 返回map中计算出的tokenId对应的uri
        return tokenUri;
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }


    // 合约部署者可以调用修改，打开售卖开关
    function flipSaleActive() public onlyOwner {
        _isSaleActive = !_isSaleActive;
    }

    // 合约部署者可以调用修改，开启盲盒开关
    function flipReveal() public onlyOwner {
        _revealed = !_revealed;
    }

    // 合约部署者可以修改，nft的mint价格
    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }
    // 合约部署者可以修改，设置没有开奖前的URI
    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }
    // 合约部署者可以修改，设置基本的URI
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }
    // 合约部署者可以修改，设置默认地址的扩展类型
    function setBaseExtension(string memory _newBaseExtension)
    public
    onlyOwner
    {
        baseExtension = _newBaseExtension;
    }
    // 合约部署者可以修改，设置每个账户可以拥有的最大nft数量
    function setMaxBalance(uint256 _maxBalance) public onlyOwner {
        maxBalance = _maxBalance;
    }
    // 合约部署者可以修改，设置一次mint nft的最大数量
    function setMaxMint(uint256 _maxMint) public onlyOwner {
        maxMint = _maxMint;
    }
    // 合约部署者可以提出合约账户中的金额
    function withdraw(address to) public onlyOwner {
        uint256 balance = address(this).balance;
        payable(to).transfer(balance);
    }
    function getMyBaseUrl() public view returns (string memory){
        return baseURI;
    }
    function getMyNotRevealedUri() public view returns(string memory){
        return notRevealedUri;
    }
    fallback () payable external {}
    receive () payable external {}
}