const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const WHITE_LIST = [
  "0x30a5f84d70dd09cf9B58DcE7754F9EB7F65B7C5a",
  "0xeEc3998ad6EF7F18c1426ad044C77FB735cfA173",
  "0x2CB679CB4f51A53d7D92EaE4FE2234721FF48984",
  "0x4172C5361d3f5fB26089dEf410652506910a6B2a",
];

const leaves = WHITE_LIST.map((x) => keccak256(x));
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getHexRoot();
// console.log("root", root);

const getMerkleProof = (address: string) => {
  const leaf = keccak256(address);
  const proof = tree.getHexProof(leaf);

  return proof;
};

export { getMerkleProof };
