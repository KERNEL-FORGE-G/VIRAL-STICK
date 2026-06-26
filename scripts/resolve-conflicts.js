const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const re = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\n]+\r?\n?/g;

function walk(dir, acc = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory() && !["node_modules", ".git"].includes(f.name)) walk(p, acc);
    else if (f.isFile()) acc.push(p);
  }
  return acc;
}

let fixed = 0;
for (const file of walk(root)) {
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("<<<<<<< HEAD")) continue;
  const nc = c.replace(re, "$1");
  if (nc !== c) {
    fs.writeFileSync(file, nc);
    fixed++;
    console.log("fixed:", path.relative(root, file));
  }
}
console.log("Total fixed:", fixed);
