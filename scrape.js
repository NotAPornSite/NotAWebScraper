const RedditScraper = require("./modules/reddit"),
      PhScraper = require("./modules/ph"),
      cron = require('node-cron');

const rs = new RedditScraper(100),
      ps = new PhScraper(100);

    rs.start().then(()=>{
    console.log("saving");
    rs.testPage += "</body></html>";
    rs.save();
}).catch(err =>{
    console.log(err);
});

setInterval(() => {
    rs.start().then(()=>{
        console.log("saving");
        rs.testPage += "</body></html>";
        rs.save();
    }).catch(err =>{
        console.log(err);
    });
}, 1000 * 60 * 6);
// cron.schedule('6 * * * *', () => {
// });
//ps.start();

