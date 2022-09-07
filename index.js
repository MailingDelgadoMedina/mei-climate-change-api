const PORT = process.env.PORT || 8000;
const axios = require("axios");
const cheerio = require("cheerio");

const express = require("express");
const app = express();
const newspapers = [
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },

  {
    name: "washingtonpost",
    address: "https://www.washingtonpost.com/climate-environment/",
    base: "",
  },

  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "nasa",
    address:
      "https://climate.nasa.gov/ask-nasa-climate/?page=0&per_page=40&order=publish_date+desc%2C+created_at+desc&search=&hide_filter_bar=true&grid_list_klass=full_news_list&category=25",
    base: "",
  },
  {
    name: "natgeo",
    address:
      "https://www.nationalgeographic.com/search?q=climate%20change&location=srp&type=recommended",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/science_and_environment",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "nypost",
    address: "https://nypost.com/tag/climate-change/",
    base: "",
  },
  {
    name: "sunsentinel",
    address: "https://sun-sentinel.search.yahoo.com/search?p=climate%20change",
    base: "",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
    })
    .catch(console.error);
});

app.get("/", (req, res) => {
  res.json("Climate Change API");
});

app.get("/climate", (req, res) => {
  res.json(articles);
});
app.get("/climate/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;
  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch(console.error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
