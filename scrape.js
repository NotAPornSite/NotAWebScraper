const RedditScraper = require("./modules/reddit"),
      PhScraper = require("./modules/ph"),
      cron = require('node-cron');

const rs = new RedditScraper(),
      ps = new PhScraper();

ps.loadCategories().then(()=>{
    ps.start().then(()=>{
        ps.save();
    }).catch(err => {
        console.log(err);
    });
});


// rs.loadSubReddits().then(()=>{
//     rs.start().then(()=>{
//         console.log("saving");
//         rs.testPage += "</body></html>";
//         rs.save();
//     }).catch(err =>{
//         console.log(err);
//     });
// });

// setInterval(() => {
//     rs.loadSubReddits().then(()=>{
//         rs.start().then(()=>{
//             console.log("saving");
//             rs.testPage += "</body></html>";
//             rs.save();
//         }).catch(err =>{
//             console.log(err);
//         });
//     });
// }, 1000 * 60 * 60);


