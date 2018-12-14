const RedditScraper = require("./modules/reddit"),
      PhScraper = require("./modules/ph");

const rs = new RedditScraper(100),
      ps = new PhScraper(100);


rs.start();
ps.start();

