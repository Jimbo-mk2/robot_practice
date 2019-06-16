
const
    puppeteer = require('puppeteer'),
    fs = require('fs'),
    process = require('process'),
    consume = require('./pupWrap.js'),
    parsedString = JSON.parse(String(process.argv[2]));

let browser,
    page,
    JSONoutput = [],
    movies = parsedString.MOVIES;

async function runBot() {

    browser = await puppeteer.launch({headless: false, defaultViewport: null});

    page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');

    await consume.navigate(page, parsedString.URL);

    console.log(`I have arrived at ${await page.url()}, leaving in 5 seconds`);
    await page.waitFor(1000);

    //--------------------- NAV TO LOGIN PAGE ----------------------------------------------------
/*
    await consume.waitThenClick(page, 'a[id="imdb-signin-link"]', 'Sign-in link');
    console.log(`I have arrived at ${await page.url()}`);

    await consume.waitThenClick(page, 'a.list-group-item:first-of-type', 'Sign-in with IMDB link');
    await consume.waitThenType(page,'input[id="ap_email"]', parsedString.UNAME, 'User name field');
    await consume.waitThenType(page,'input[id="ap_password"]', parsedString.PASS, 'Password field');
    console.log('entered login creds');

    await page.click('input[id="signInSubmit"]');
    console.log('clicked the button');
    debugger;
*/
    //----------------------- ENTER SEARCH TERMS ---------------------------------

    for (let movie of movies) {

        let subText = [];
        await consume.waitThenType(page, '#navbar-query', movie, 'Search Bar');
        await consume.waitThenClick(page, `button[id="navbar-submit-button"]`, 'Search Submit');
        await consume.waitThenClick(page, 'td[class="primary_photo"]', 'clicked movie poster');


        //--------------------------- SCRAPE DATA AND CREATE OBJECT --------------------------

        await page.waitForSelector('div[class="title_wrapper"');

        let title = await consume.evaluate(page, 'div[class="title_wrapper"] > h1', 'Header Data');

        subText = await page.evaluate(() => document.querySelector('div[class="subtext"]').innerText.split(' | '));
        let genre = subText[2].split(', ');
        let release = subText[3];
        let duration = subText[1];
        let rating = subText[0];

        const scrapedDetails = {title, genre, rating, duration, release};
        JSONoutput.push(scrapedDetails);
    }
    //--------------------------------- STRINGIFY RESULTS AND WRITE TO FILE ------------------------------
    const stringyOutput = JSON.stringify(JSONoutput);
    console.log(stringyOutput);

    fs.appendFile("movies.json", stringyOutput, (err) => {
        if (err) console.log(err);
        console.log('writing entries to file');
    });

    await page.close();
    await browser.close();
    return process.exit(0);

}

runBot().catch(async (err) => {
    console.log(err);
    if (browser) {
        await browser.close();
    }
    return process.exit(1);
});