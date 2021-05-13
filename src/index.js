const title = require("url-to-title");
const { readFileSync, writeFileSync, unlinkSync, existsSync } = require("fs");
const { join } = require("path");

const file = join(__dirname, "../input.txt");
const output = join(__dirname, "../output.txt");

(async () => {
  try {
    console.time("start");

    const data = readFileSync(file, {
      flag: "r",
      encoding: "utf8",
    });

    const map = new Map();
    const rows = data.split("\n");

    rows.forEach((v) => {
      if (v !== "") {
        const [href] = v.split("|");
        const removeWWW = href.replace("www.", "").trim();

        const [_, match] = removeWWW.match(/\/\/(\w+)./);
        const list = map.get(match) || new Set();

        list.add(removeWWW);
        map.set(match, list);
      }
    });

    if (existsSync(output)) {
      unlinkSync(output);
    }

    for (const iterator of map.values()) {
      let data = [];
      const urls = [...iterator];

      try {
        data = await title(urls);
      } catch (error) {
        console.error(error);
        console.error(urls);
      }

      const texts =
        urls.map((url, i) => `${url} | ${data[i] || "no title"}`).join("\n") +
        "\n\n";

      writeFileSync(output, texts, {
        flag: "a+",
        encoding: "utf-8",
      });
    }

    console.timeEnd("start");
  } catch (error) {
    console.error(error);
  }
})();
