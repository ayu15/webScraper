const request = require('request');
const rp = require('request-promise');

let urlPre = 'http://site.api.espn.com/apis/site/v2/sports/cricket/13366/playbyplay?contentorigin=espn&event=441828&lang=en&page=';
let urlPost = '&period=1&region=in&section=cricinfo';
let responsePages = [];

const getTotalPages = async () => {
    return request(getCurrentUrl(1), function (error, response, body) {
        return JSON.parse(body).commentary.pageCount;
    });
};
const getCurrentUrl = (pageNum) => {
    return urlPre + pageNum + urlPost;
};
const getCurrentPageData = async (currPageNum) => {
    return rp(getCurrentUrl(currPageNum))
        .then((response)=>{
            const tempObj = {};
            const commentary = JSON.parse(response).commentary;
            commentary.items.forEach((item, index)=>{
                tempObj[index.toString()] = item.playType.description;
            });
            return tempObj;
    })
        .catch((e)=>{
            console.log('something wrong buddy');
        })
};
const getFirst5PageData = async ()=>{
    const dataSet = [];
    for(let i =1; i<6; i++){
        dataSet.push(await getCurrentPageData(i));
    }
    return JSON.stringify(dataSet);
};

getFirst5PageData(1)
.then((result)=>{
    console.log('final result is ', result);
});