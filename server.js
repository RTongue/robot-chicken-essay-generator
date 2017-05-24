const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');
const app = express();

const allEpisodeLinks = require('./season-episode-links');

app.get('/season-episode-links', (req, res, next) => {
  // All the web scraping magic will happen here
  const url = 'http://www.springfieldspringfield.co.uk/episode_scripts.php?tv-show=robot-chicken';

  request(url, (error, response, html) => {
        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which
            // will essentially give us jQuery functionality
            const $ = cheerio.load(html);
            // Finally, we'll define the variables we're going to capture
            const json = {};

            const lists = $('.season-episodes');
            const hrefs = _.map(lists, (list, i) => {
              return list.children.filter(item => item.name === 'a')
                .map(item => item.attribs.href);
            });

            hrefs.forEach((list, season) => {
              json[`season-${season + 1}`] = list;
            })

            fs.writeFile('season-episode-links.json', JSON.stringify(json, null, 4), (err) => {
              console.log('File successfully written! - Check your project directory for the season-episode-links.json file');
            });
        }


        res.send('Check your console!');
    });
});

app.get('/all-scripts', (req, res, next) => {
  const json = {};
  let allPromises = [];

  for (const season in allEpisodeLinks) {
    let episodes = allEpisodeLinks[season];
    episodes = episodes.map((episode, i) => {
      return new Promise((resolve, reject) => {
        request(`http://www.springfieldspringfield.co.uk/${episode}`, (error, response, html) => {
        // First we'll check to make sure no errors occurred when making the request
          if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which
            // will essentially give us jQuery functionality
            const $ = cheerio.load(html);
            // Finally, we'll define the variables we're going to capture
            const script = $('.scrolling-script-container').text();
            if (!json[season]) json[season] = {};
            json[season][`episode-${i}`] = script;
            resolve(script);
          } else {
            reject(error);
          }
        });
      });
    });
    allPromises = [...allPromises, ...episodes];
  }

  Promise.all(allPromises)
    .then((val) => {
      fs.writeFile('scripts.json', JSON.stringify(json, null, 4), (err) => {
        console.log('File successfully written! - Check your project directory for the scripts.json file');
      });
      res.send('Check your console!');
    })
    .catch(error => console.error(error));
});

app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
