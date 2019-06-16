
const
    puppeteer = require('puppeteer'),
    fs = require('fs'),
    process = require('process'),
    consume = require('./pupWrap.js');

let browser,
    page;

let parsedString = JSON.parse(String(process.argv[2]));

let JSONoutput = [];

let movies = parsedString.MOVIES;

async function runBot() {

    browser = await puppeteer.launch({headless:false});
    page = await browser.newPage();

    await consume.navigate(page, parsedString.URL);
    console.log(`I have arrived at ${await page.url()}, leaving in 5 seconds`);
    await page.waitFor(1000);

    //--------------------- NAV TO LOGIN PAGE ----------------------------------------------------

    await consume.waitThenClick(page, 'a[id="imdb-signin-link"]', 'Sign-in link')
    await page.waitForNavigation({ waitUntil: ' networkidle2' });
    console.log(`I have arrived at ${await page.url()}`);

    //await page.click('a.list-group-item:first-of-type');
    await consume.waitThenClick(page, 'a.list-group-item:first-of-type', 'Sign-in with IMDB link')
    await page.waitForSelector('input[id="ap_password"]');
    console.log('Found login input fields.');

    await page.type('input[id="ap_email"]', parsedString.UNAME);
    await page.type('input[id="ap_password"]', parsedString.PASS);
    console.log('entered login creds');

    await page.click('input[id="signInSubmit"]');
    console.log('clicked the button');

    //----------------------- ENTER SEARCH TERMS ---------------------------------

    for (let movie of movies) {

        let subText = [];

        await page.waitForSelector('#navbar-query');
        await page.type('#navbar-query', movie);
        await page.click(`button[id="navbar-submit-button"]`);
        await page.waitForSelector('td[class="primary_photo"]');

        await page.click('td[class="primary_photo"]');

        await page.waitForSelector('div[class="title_wrapper"]');

        //--------------------------- SCRAPE DATA AND CREATE OBJECT --------------------------
        let title = await page.evaluate(() =>
            document.querySelector('div[class="title_wrapper"] > h1').innerText.trim());
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