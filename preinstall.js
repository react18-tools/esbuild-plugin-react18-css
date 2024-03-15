// Run bash script
const fs = require("fs");
const path = require("path");

const readMePath = path.resolve(process.cwd(), "README.md");
let readMe = fs.readFileSync(readMePath, "utf8");
readMe = readMe.replace(/## Features(?:.|\n|\r)*#### Create a library that is/m, "## Features");
readMe = readMe.replace(/## Introduction(?:.|\n|\r)*## Step/m, "## Step");

fs.writeFileSync(readMePath, readMe);

/** run the old bash script */
require("child_process").spawn("bash", ["./preinstall.sh"], { stdio: "inherit" });

/** delete this file */
fs.unlinkSync(path.resolve(process.cwd(), "preinstall.js"));
