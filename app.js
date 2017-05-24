const fs = require('fs');
const _ = require('lodash');
const markov = require('markov');
const m = markov();

const scripts = require('./scripts.json');
const allText = _.reduce(scripts, (accum, episodes) => {
  return _.reduce(episodes, (text, episode) => {
    return text + '' + episode.toLowerCase().trim().replace(/[^a-z ]/g, '');
  }, '');
}, '');

console.log('Seeding... hang on a second...');

m.seed(allText, () => {
  const stdin = process.openStdin();
  console.log('> In one word, what\'s your essay about?');

  stdin.on('data', (line) => {
    const res = m.respond(line.toString(), 40)
    for (let i = 0; i < res.length; i++) {
      const word = res[i]
      if (i % 10 === 0) {
        res[i] = word[0].toUpperCase() + word.slice(1);
      } else if (i % 10 === 9) {
        res[i] = `${word}.`;
      }
    }
    console.log(res.join(' '));
    console.log('> ');
  });
});
