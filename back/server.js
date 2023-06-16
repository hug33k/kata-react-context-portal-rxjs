const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require("fs");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/themes/", express.static("themes/", { extensions: ["json"] }));

app.get("/themes", (_, res) => {
    fs.readdir('themes/', (_, list) => {
        res.json(list.map((theme) => theme.replace(".json", "")));
    });
});

app.post("/themes/", (req, res) => {
    const themes = req.body;
    Object.keys(themes).forEach((theme) => {
        fs.writeFile(`themes/${theme}.json`, JSON.stringify(themes[theme]), () => {});
    });
    res.send({ status: true });
});

app.post("/themes/:theme", (req, res) => {
    const theme = req.body;
    fs.writeFile(`themes/${req.params.theme}.json`, JSON.stringify(theme), () => {});
    res.send({ status: true });
});

app.delete("/themes/:theme", (req, res) => {
    fs.unlink(`themes/${req.params.theme}.json`, () => {});
    res.send({ status: true });
});

app.listen(3003);
