const RedditScraper = require("./modules/reddit"),
      PhScraper = require("./modules/ph");

const rs = new RedditScraper(100),
      ps = new PhScraper(100);


rs.start().then(()=>{
    console.log("saving");
    rs.testPage += "</body></html>";
    rs.save();
});
//ps.start();

