const fs = require("fs");
const path = require("path");

const sourceFolder = path.join(__dirname, "json");

const TARGET_URI = process.env.URI

const files = fs.readdirSync(sourceFolder);
files.forEach((fileName) => {
  const filePath = path.join(sourceFolder, fileName);
  const content = fs.readFileSync(filePath, "utf-8");

  fs.writeFileSync(
    filePath,
    content.replace("YourImageURI", TARGET_URI),
    "utf-8"
  );
});