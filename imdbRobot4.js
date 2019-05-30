
const
    puppeteer = require('puppeteer'),
    utils = require('utils'),
    fs = require('fs'),
    process = require('process');

let browser,
    page;

let parsedString = JSON.parse(String(process.argv[2]));

let JSONoutput = [];

let movies = parsedString.MOVIES;

async function runBot() {

    browser = await puppeteer.launch({headless:false});

    page = await browser.newPage();

    await page.goto(parsedString.URL).catch((err) => {
        return Promise.reject(utils.buildError("NAVIGATION FAILURE", `${err}`));
    });

    console.log(`I have arrived at ${await page.url()}, leaving in 5 seconds`);
    await page.waitFor(1000);

    //---------------------LOGIN AND NAVIGATE TO WATCHLIST----------------------------------------------------
           
    await page.click('a[id="imdb-signin-link"]');
    await page.waitForNavigation({ waitUntil: 'load' });
    console.log(`I have arrived at ${await page.url()}`);

    await page.click('a.list-group-item:first-of-type');
    await page.waitForSelector('input[id="ap_password"]');
    console.log('filling in login creds.');

    await page.type('input[id="ap_email"]', parsedString.UNAME);
    await page.type('input[id="ap_password"]', parsedString.PASS);
    console.log('entered login creds');

    await page.click('input[id="signInSubmit"]');
    console.log('clicked the button');



    //-----------------------ENTER SEARCH TERM---------------------------------
    for (let movie of movies) {
        await page.waitForSelector('#navbar-query');
        await page.type('#navbar-query', movie);
        await page.waitForSelector('#navbar-suggestionsearch > div:nth-child(1) > a > div.navbar-suggestionsearch-poster');
        await page.click('#navbar-suggestionsearch > div:nth-child(1) > a > div.navbar-suggestionsearch-poster');
        await page.waitForNavigation({waitUntil: 'load'});
    }


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