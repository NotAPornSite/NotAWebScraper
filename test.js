//react-native
const JSSoup = require('jssoup').default,
      request = require("request-promise"),
      fs = require("fs");


let getSubReddits = function(){
    let subreddits =  [];
        var options = {
            uri: 'https://www.reddit.com/r/ListOfSubreddits/wiki/nsfw',
            headers: {
                'Cookie': 'over18=1'
            }    
        };
         
        request(options).then((html)=>{
            let soup = new JSSoup(html);
    
            let links = soup.findAll("a");

            
            links.forEach((link)=>{
                console.log(link.attrs["href"]);
                if(!subreddits.includes(link.attrs["href"]) && link.attrs["href"] && link.attrs["href"][0] === "/" && link.attrs["href"][1] === "r"){
                    subreddits.push("https://www.reddit.com"+link.attrs["href"]);
                }
            });
            fs.writeFile('./data/subreddits.json', JSON.stringify(subreddits));

        }).catch((err)=>{
            console.error(err);
        });
};
getSubReddits();


// let getLinks = function(href){
//     let page =  "<html><head></head><body>";
//     var options = {
//         uri: 'https://www.reddit.com/r/gonewild',
//         headers: {
//             'Cookie': 'over18=1'
//         }    
//     };
     
//     request(options).then((html)=>{
//         let soup = new JSSoup(html);

//         let links = soup.findAll("img");

//         links.forEach((link)=>{
//             page += "<img src='"+link.attrs["src"]+"'/>";
//             console.log(link.attrs["src"]);
            
//         });
//         page += "</body></html>";
//         console.log(page);
//         fs.writeFile('test.html', page);
//     }).catch((err)=>{
//         //console.error(err);
//     });
// };

// getLinks("https://www.reddit.com/r/gonewild");

// let githubLinks = [],
//     visited = [];

// let save = function(){
//     let json = JSON.stringify(githubLinks); 
//     fs.writeFile('links.json', json);
//     console.log(githubLinks.length);
// };

// let load = function(){
//     fs.readFile('links.json', function(err, data){
//         var obj;
//         if (err){
//            // console.log(err);
//         } else {
//             obj = JSON.parse(data); 
//         }
//         obj.forEach(link=>{
//             if(!visited.includes(link)){
//                 getLinks(link);
//             }
//         });
//     });
// };

// let getLinks = function(href){
//     request.get(href).then((html)=>{
//         let soup = new JSSoup(html);
    
//         let links = soup.findAll("a");
    
//         links.forEach((link)=>{
//             if(link.attrs["href"].includes("github") && !githubLinks.includes(link.attrs["href"])){
//                 if(link.attrs["href"][0] === "/"){
//                     link.attrs["href"] = href+link.attrs["href"];
//                 }
//                 githubLinks.push(link.attrs["href"]);
//             }
//         });
//         visited.push(href);
//         save();
//     }).catch((err)=>{
//         //console.error(err);
//     });
// };

// load();


