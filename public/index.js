const express = require("express");
const fetch = require("node-fetch");

const app = express();

// برای دریافت body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// relay endpoint
app.all("*", async (req, res) => {
  try {
    const target = req.query.url;

    if (!target) {
      return res.status(400).send("Missing target url");
    }

    const response = await fetch(target, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
      },
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body),
    });

    const data = await response.buffer();

    res.status(response.status);

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
