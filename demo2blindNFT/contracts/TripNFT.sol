// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TripNFT is Ownable, ERC721Enumerable {
    using Strings for uint256;
    using SafeMath for uint256;

    // 白名单merkleTree的根hash
    bytes32 public merkleRootHash =
        0xfdbb9776475fc02fbd67aded2b6edb467ef1c653380995853a76d68cfa0f72a8;

    // nft售卖开关
    bool public saleIsActive = false;
    // 1 预售 2 公售
    uint256 public saleStage = 0;

    // 盲盒开关
    bool public revealedState = false;

    // 合约发行的nft总数量10000个，盲盒可开8888个，剩余为限定
    uint256 public constant MAX_SUPPLY = 1000;

    // 盲盒限定的个数
    uint256 public constant BOX_SUPPLY = 880;

    // 铸造Nft的价格
    uint256 public mintPrice = 10000000000000000; //0.01 ETH

    // 每个账户最多拥有nft的数量
    uint256 public maxBalance = 5;

    // 单次mint nft的数量
    uint256 public maxMint = 2;

    // 元数据的baseURI
    string public baseURI =
        "ipfs://QmTKySihsR9BRUzsfWXKt3LeMCb1BSxpLQjndJLhiEe8pk";

    // 特殊URI
    string public specialURI = "";

    // 盲盒封面的元数据
    string public unrevealedURI =
        "ipfs://QmRzUk7SgUgU928GkYFe5yerLQzVke1AVx9jhimAziBcAU";

    // 元数据的扩展类型
    string public baseExtension = ".json";

    // map tokenId 与 tokenURI的映射
    mapping(uint256 => string) private tokenURIs;

    // 预留的售卖地址,默认为合约部署地址
    address private reserveAddress;

    // 合约构造函数
    constructor() ERC721("YouYouNFT", "YOUYOU") {
        reserveAddress = msg.sender;
    }

    /**
     * @dev 判断合约调用账户是否在白名单中
     * @param merkleProof: 合约调用账户的 merkleProof
     * @return bool : 是否是白名单用户
     */
    function isValidUser(bytes32[] calldata merkleProof)
        public
        view
        returns (bool)
    {
        // 生成当前要校验节点的hash值
        bytes32 leafNode = keccak256(abi.encodePacked(msg.sender));
        // 校验是否为白名单用户
        return MerkleProof.verify(merkleProof, merkleRootHash, leafNode);
    }

    /**
     * @dev 白名单用户免费mint nft (接收方为合约的直接调用账户)
     * @param numberOfTokens: mint nft 的数量
     * @param merkleProof: 合约调用账户的 merkleProof
     */
    function preMint(uint256 numberOfTokens, bytes32[] calldata merkleProof)
        public
        payable
    {
        // 校验msg.sender是否是白名单用户
        require(
            isValidUser(merkleProof) == true,
            "msg.sender is not in whitelist"
        );

        // 校验当前合约账户中的nft数量 + 铸造的数量 <= nft的最大供应数量
        require(
            totalSupply() + numberOfTokens <= MAX_SUPPLY,
            "Sale would exceed max supply"
        );

        // 校验售卖状态
        require(saleStage == 1 ,"Not in preMint time");

        // 校验nft是否开始售卖
        require(saleIsActive, "Sale must be active to mint NicMetas");

        // 校验msg.sender所拥有的的nft数量需要小于每个账户nft的限制个数
        require(
            balanceOf(msg.sender) + numberOfTokens <= maxBalance,
            "Sale would exceed max balance"
        );

        // 校验本次铸造的数量 <= 本次铸造的最大数量
        require(numberOfTokens <= maxMint, "exceed max mint at a time");

        // 以上校验条件满足，进行nft的铸造
        for (uint256 i = 0; i < numberOfTokens; i++) {
            // mintIndex是铸造nft的序号
            uint256 mintIndex = totalSupply();

            if (totalSupply() < MAX_SUPPLY) {
                // 调用ERC721.sol的_safeMint方法 为recipient账户分配这个tokenId
                _safeMint(msg.sender, mintIndex);
            }
        }
    }

    /**
     * @dev 公售 (接收方为合约的直接调用账户)
     * @param numberOfTokens: mint nft 的数量
     */
    function publicMint(uint256 numberOfTokens) public payable {
        // 校验本次铸造的数量 * 铸造的价格 <= 本次交易附带的金额
        require(
            numberOfTokens.mul(mintPrice) <= msg.value,
            "Not enough ether sent"
        );
        // 校验当前合约账户中的nft数量 + 铸造的数量 <= nft的最大供应数量
        require(
            totalSupply() + numberOfTokens <= MAX_SUPPLY,
            "Sale would exceed max supply"
        );

        // 校验售卖状态
        require(saleStage == 2 ,"Not in publicMint time");

        // 校验nft是否开始售卖
        require(saleIsActive, "Sale must be active to mint NicMetas");

        // 校验msg.sender所拥有的的nft数量需要小于每个账户nft的限制个数
        require(
            numberOfTokens + balanceOf(msg.sender) <= maxBalance,
            "Sale would exceed max balance"
        );

        // 校验本次铸造的数量 <= 本次铸造的最大数量
        require(numberOfTokens <= maxMint, "exceed max mint at a time");

        for (uint256 i = 0; i < numberOfTokens; i++) {
            // mintIndex是铸造nft的序号
            uint256 mintIndex = totalSupply();

            if (totalSupply() < MAX_SUPPLY) {
                // 调用ERC721.sol的_safeMint方法 为msg.sender账户分配这个tokenId
                _safeMint(msg.sender, mintIndex);
            }
        }
    }

    /**
     * @dev 返回tokenId 对应的 tokenURI
     * @param tokenId : tokenId
     * @return string : tokenURI
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        // 校验tokenId存在
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        // 如果未开启盲盒则返回盲盒封面URI
        if (revealedState == false) {
            return unrevealedURI;
        }
        // 获取tokenId对应的tokenURI
        string memory URI = tokenURIs[tokenId];
        // 获取baseURI
        string memory base = _baseURI();
        // 如果tokenURI不为空，则返回specialURI拼接的URI
        if (bytes(URI).length > 0) {
            return
                string(
                    abi.encodePacked(
                        base,
                        "/",
                        URI,
                        "/",
                        tokenId.toString(),
                        baseExtension
                    )
                );
        }
        // 返回baseURI、tokenId 和 baseExtension 的拼接字符串
        return
            string(
                abi.encodePacked(base, "/", tokenId.toString(), baseExtension)
            );
    }

    /**
     * @dev 将剩余的盲盒nft数量mint掉，用于openSea售卖
     */
    function reserveNFT() public onlyOwner {
        for (uint256 i = 0; i < 50; i++) {
            uint256 mintIndex = totalSupply();
            _safeMint(reserveAddress, mintIndex);
        }
    }

    /**
     * @dev mint特殊nft (100个，对应tokenId为 9900-9999)
     */
    function reserveSpecialNFT() public onlyOwner {
        for (uint256 i = 9900; i < 10000; i++) {
            uint256 mintIndex = i;
            _safeMint(reserveAddress, mintIndex);
            _setTokenURI(mintIndex, specialURI);
        }
    }

    /**
     * @dev 将合约账户中的以太币转到指定账户中
     * @param to : 接收的地址
     */
    function withdrawMoney(address to) public onlyOwner {
        payable(to).transfer(address(this).balance);
    }

    /**
     * @dev 设置tokenID的元数据URL
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev 返回baseURI
     * @return string : baseURI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev 修改售卖状态
     */
    function flipSaleActive() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    /**
     * @dev 修改盲盒状态
     */
    function flipReveal() public onlyOwner {
        revealedState = !revealedState;
    }

    /**
     * @dev 修改mintPrice
     */
    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    /**
     * @dev 设置盲盒封面URI
     */
    function setNotRevealedURI(string memory _unrevealedURI) public onlyOwner {
        unrevealedURI = _unrevealedURI;
    }

    /**
     * @dev 设置baseURI
     * @param _newBaseURI : baseURI
     */
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    /**
     * @dev 设置元数据的扩展类型
     */
    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    /**
     * @dev 每个账户最多拥有nft的数量
     */
    function setMaxBalance(uint256 _maxBalance) public onlyOwner {
        maxBalance = _maxBalance;
    }

    /**
     * @dev 设置一次mint nft的最大数量
     */
    function setMaxMint(uint256 _maxMint) public onlyOwner {
        maxMint = _maxMint;
    }

    /**
     * @dev 设置rootHash
     */
    function setRootHash(bytes32 _merkleRootHash) public onlyOwner {
        merkleRootHash = _merkleRootHash;
    }

    /**
     * @dev 设置saleStage
     */
    function setSaleStage(uint256 _stage) public onlyOwner {
        saleStage = _stage;
    }

    fallback() external payable {}

    receive() external payable {}
}
