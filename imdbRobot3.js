
const
    puppeteer = require('puppeteer'),
    utils = require('utils'),
    fs = require('fs'),
    process = require('process');

let browser,
    page;

let parsedString = JSON.parse(String(process.argv[2]));

let JSONoutput = [];

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

    await page.waitForSelector('#navWatchlistMenu');
    await page.click('#navWatchlistMenu > p > a');
    console.log('clicked watchlist');

    //-----------------------EVALUATE PAGE AND SCRAPE DETAILS FROM EACH ENTRY---------------------------------

    await page.waitForSelector('.lister-item');
    console.log('watchlist items have loaded');

    const movieEntriesArray = await page.$$("div[class='lister-item featureFilm']");

    for(let movieEntry of movieEntriesArray) {
        console.log("scraping data")
;        let title = await movieEntry.$eval("h3[class='lister-item-header']", element => element.innerText.trim());
        let genre = await movieEntry.$eval("span[class='genre hidden-xs']", element => element.innerText.trim().split(", "));
        let rating = await movieEntry.$eval("span[class='certificate']", element => element.innerText.trim());
        let duration = await movieEntry.$eval("span[class='runtime']", element => element.innerText.trim());
        let release = await movieEntry.$eval("span[class='lister-item-year']", element => element.innerText.trim());

        const output = {title, genre, rating, duration, release};
        const stringyOutput = JSON.stringify(output);
        JSONoutput.push(stringyOutput);
    }

    fs.appendFile("movies.json", JSONoutput, (err) => {
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