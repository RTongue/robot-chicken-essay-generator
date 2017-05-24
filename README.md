## Robot Chicken Essay Generator

Need to write an essay but don't know what to write about? Use this simple Robot Chicken Essay Generator! RCEG will meticulously gather the scripts of every episode of Robot Chicken from the internet for you like so:

```
git clone
npm - or - yarn install
npm run scrape
```

Once your server is going, navigate to `localhost:8081/season-episode-links` first to generate links to the episodes, then `localhost:8081/all-scripts`.

After scraping the data, start up the random essay generator utility like so:

```
npm run generate
```

After the app seeds the Markov chain, you'll be given the prompt "In one word, what's your essay about?" Type a word and hit enter, then the algorithm will go to work making your randomly generated essay!
