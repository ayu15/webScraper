const puppeteer = require('puppeteer');
const fs = require('fs');

let getAllData = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 60000
    });
    const page = await browser.newPage();
    const profiles = [576, 1413, 314];
    const players = [];

    const getPlayerData = async (profile) => {
        await page.goto('http://www.cricbuzz.com/profiles/' + profile);

        return await page.evaluate(() => {
            const numOfMatches = [],
                fifties = [],
                hundreds = [],
                innings = [],
                notOuts = [],
                runs = [],
                highScores = [],
                averages = [],
                ballsFaced = [],
                strikeRates = [],
                twoHundreds = [],
                fours = [],
                sixes = [];
            let test, odi, t20, ipl;
            const objPlayerName = document.querySelector('#playerProfile > div.cb-col.cb-col-100.cb-bg-white > div:nth-child(2) > h1').innerText;
            const objPlayerTeam = document.querySelector('#playerProfile > div.cb-col.cb-col-100.cb-bg-white > div:nth-child(2) > h3').innerText;
            const testMatchData = document.querySelector('#playerProfile > div.cb-col.cb-col-100.cb-bg-grey > div.cb-col.cb-col-67.cb-bg-white.cb-plyr-rt-col > div > div:nth-child(2) > table > tbody > tr:nth-child(1)').innerText.split('\t');
            const odiData = document.querySelector('#playerProfile > div.cb-col.cb-col-100.cb-bg-grey > div.cb-col.cb-col-67.cb-bg-white.cb-plyr-rt-col > div > div:nth-child(2) > table > tbody > tr:nth-child(2)').innerText.split('\t');
            const t20Data = document.querySelector('#playerProfile > div.cb-col.cb-col-100.cb-bg-grey > div.cb-col.cb-col-67.cb-bg-white.cb-plyr-rt-col > div > div:nth-child(2) > table > tbody > tr:nth-child(3)').innerText.split('\t');
            const iplData = document.querySelector('#playerProfile > div.cb-col.cb-col-100.cb-bg-grey > div.cb-col.cb-col-67.cb-bg-white.cb-plyr-rt-col > div > div:nth-child(2) > table > tbody > tr:nth-child(4)').innerText.split('\t');
            console.log('test data is ', testMatchData);
            for (let i = 1; i < testMatchData.length; i++) {
                switch (i) {
                    case 1:
                        numOfMatches.push(testMatchData[i]);
                        numOfMatches.push(odiData[i]);
                        numOfMatches.push(t20Data[i]);
                        numOfMatches.push(iplData[i]);
                        break;
                    case 2:
                        innings.push(testMatchData[i]);
                        innings.push(odiData[i]);
                        innings.push(t20Data[i]);
                        innings.push(iplData[i]);
                        break;
                    case 3:
                        notOuts.push(testMatchData[i]);
                        notOuts.push(odiData[i]);
                        notOuts.push(t20Data[i]);
                        notOuts.push(iplData[i]);
                        break;
                    case 4:
                        runs.push(testMatchData[i]);
                        runs.push(odiData[i]);
                        runs.push(t20Data[i]);
                        runs.push(iplData[i]);
                        break;
                    case 5:
                        highScores.push(testMatchData[i]);
                        highScores.push(odiData[i]);
                        highScores.push(t20Data[i]);
                        highScores.push(iplData[i]);
                        break;
                    case 6:
                        averages.push(testMatchData[i]);
                        averages.push(odiData[i]);
                        averages.push(t20Data[i]);
                        averages.push(iplData[i]);
                        break;
                    case 7:
                        ballsFaced.push(testMatchData[i]);
                        ballsFaced.push(odiData[i]);
                        ballsFaced.push(t20Data[i]);
                        ballsFaced.push(iplData[i]);
                        break;
                    case 8:
                        strikeRates.push(testMatchData[i]);
                        strikeRates.push(odiData[i]);
                        strikeRates.push(t20Data[i]);
                        strikeRates.push(iplData[i]);
                        break;
                    case 9:
                        hundreds.push(testMatchData[i]);
                        hundreds.push(odiData[i]);
                        hundreds.push(t20Data[i]);
                        hundreds.push(iplData[i]);
                        break;
                    case 10:
                        twoHundreds.push(testMatchData[i]);
                        twoHundreds.push(odiData[i]);
                        twoHundreds.push(t20Data[i]);
                        twoHundreds.push(iplData[i]);
                        break;
                    case 11:
                        fifties.push(testMatchData[i]);
                        fifties.push(odiData[i]);
                        fifties.push(t20Data[i]);
                        fifties.push(iplData[i]);
                        break;
                    case 12:
                        fours.push(testMatchData[i]);
                        fours.push(odiData[i]);
                        fours.push(t20Data[i]);
                        fours.push(iplData[i]);
                        break;
                    case 13:
                        sixes.push(testMatchData[i]);
                        sixes.push(odiData[i]);
                        sixes.push(t20Data[i]);
                        sixes.push(iplData[i]);
                        break;
                }
            }
            for (let i = 0; i < 4; i++) {
                const fData = {};
                fData.numOfMatches = numOfMatches[i];
                fData.innings = innings[i];
                fData.notOuts = notOuts[i];
                fData.runs = runs[i];
                fData.highScores = highScores[i];
                fData.averages = averages[i];
                fData.ballsFaced = ballsFaced[i];
                fData.strikeRates = strikeRates[i];
                fData.hundreds = hundreds[i];
                fData.twoHundreds = twoHundreds[i];
                fData.fifties = fifties[i];
                fData.fours = fours[i];
                fData.sixes = sixes[i];
                switch (i) {
                    case 0:
                        test = fData;
                        break;
                    case 1:
                        odi = fData;
                        break;
                    case 2:
                        t20 = fData;
                        break;
                    case 3:
                        ipl = fData;
                        break;
                }
            }
            const objPlayer = {};
            objPlayer.name = objPlayerName;
            objPlayer.team = objPlayerTeam;
            objPlayer.test = test;
            objPlayer.odi = odi;
            objPlayer.t20 = t20;
            objPlayer.ipl = ipl;
            return objPlayer;
        });
    };

    for (let profile of profiles) {
        players.push(await getPlayerData(profile));
    }

    browser.close();
    return players; // Return the data
};

getAllData().then((value) => {
    // console.log(value); // Success!
    fs.writeFileSync('extracted.json', JSON.stringify(value), (e) => {
        if (e) throw e;
        console.log('The file has been saved!');
    })
});