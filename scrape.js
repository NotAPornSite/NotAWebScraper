const rp = require('request-promise'),
      $ = require('cheerio'), 
      url = 'https://en.wikipedia.org/wiki/George_Washington',
      url2 = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

rp(url)
.then(function(html) {
  console.log($('.firstHeading', html).text());
  console.log($('.bday', html).text());
})
.catch(function(err) {
  //handle error
});

rp(url2).then(function(html){
  //success!
  const wikiUrls = [];
  for (let i = 0; i < 45; i++) {
    wikiUrls.push($('big > a', html)[i].attribs.href);
  }
  console.log(wikiUrls);
})
.catch(function(err){
  //handle error
});
