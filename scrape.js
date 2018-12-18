const RedditScraper = require("./modules/reddit"),
      PhScraper = require("./modules/ph"),
      cron = require('node-cron');

const rs = new RedditScraper(100),
      ps = new PhScraper(100);

setInterval(() => {
    rs.start().then(()=>{
        console.log("saving");
        rs.testPage += "</body></html>";
        rs.save();
    }).catch(err =>{
        console.log(err);
    });
}, 1000 * 60 * 60);
// cron.schedule('6 * * * *', () => {
// });
//ps.start();

