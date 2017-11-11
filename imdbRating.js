const puppeteer = require('puppeteer');
const fs = require('fs');
const moment = require('moment');
let urlPre = 'http://www.imdb.com/title/';
let urlPost = '/ratings';
const titles = ['tt7399470','tt7469726','tt6692354', 'tt1806913','tt6108090'];
const getCurrentUrl = (pageNum) => {
    return urlPre + pageNum + urlPost;
};
const getWritingMoment = ()=>{
    let c = moment().format("MMM D H-mm-ss");
    return c.toString();
}
let getAllData = async () => {
    const titleData = [];
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 60000
    });
    const page = await browser.newPage();
    const getRatings = async (cTitle) => {
        await page.goto(getCurrentUrl(cTitle));
        return await page.evaluate(() => {
            const rTableData = {};
            const ratingNum = {};
            let tVotes =0;
            const objTitleName = document.querySelector('#main > section > div > div.subpage_title_block > div.parent > h3').innerText;
            const objRAvg = parseFloat(document.querySelector('#main > section > div > div.subpage_title_block > div.ipl-ratings-bar > div > span').innerText);
            for(let j = 2; j< 5; j++){
                let rDemographic = {};                                    
                for (let i = 2; i< 7; i++){
                    let objRall = document.querySelector('#main > section > div > table:nth-child(14) > tbody > tr:nth-child('+j+') > td:nth-child('+i+')').innerText.split('\n').slice(1, 3);
                    switch (i) {
                        case 2:
                        rDemographic.all = objRall;
                        break;
                        case 3:
                        rDemographic.kids = objRall;
                        break;
                        case 4:
                        rDemographic.youth = objRall;
                        break;
                        case 5:
                        rDemographic.middle = objRall;
                        break;
                        case 6:
                        rDemographic.old = objRall;
                        break;
                    }
                }
                switch (j) {
                    case 2:
                    rTableData.rAll = rDemographic;
                    break;
                    case 3:
                    rTableData.rMale= rDemographic;
                    break;
                    case 4:
                    rTableData.rFemale= rDemographic;
                }
            }
            for (let i = 2; i< 12; i++){
                const objRNumValue = parseInt(document.querySelector('#main > section > div > table:nth-child(7) > tbody > tr:nth-child('+i+') > td:nth-child(3)').innerText);
                ratingNum[(12-i).toString()] = objRNumValue;
                tVotes = tVotes + objRNumValue;
            };
            for( let i = 3; i< 5; i++){
                const obj = document.querySelector('#main > section > div > table:nth-child(16) > tbody > tr:nth-child(2) > td:nth-child('+i+')').innerText.split('\n').slice(1, 3);
                i ===3 ? rTableData.rUS = obj: rTableData.rNonUs = obj;
            }
            // rTableData.id = cTitle;
            rTableData.title = objTitleName;                        
            rTableData.rNum = ratingNum;
            rTableData.totalVotes = tVotes;
            rTableData.rAvg = objRAvg;
            return rTableData;
        });
    };
    for (let ctitle of titles) {
        titleData.push(await getRatings(ctitle));
    }
    browser.close();
    return titleData; // Return the data
};

getAllData().then((value) => {
    // console.log(value); // Success!
    for( let i = 0; i< value.length; i++){
        try {
            const myFile = './'+value[i].title+getWritingMoment()+'.json';
            console.log('my file is ', myFile);
            fs.writeFile(myFile, JSON.stringify(value[i], null, 2), (e) => {
                if (e) throw e;
                console.log('The file has been saved!');
            })
        } catch(e){
            console.log('erroor is ', e)
        }
    }
});