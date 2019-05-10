
/**
 *
 * Consts: these are the packages that we are allowing this script to use
 *  the packages are located in 'node modules' and were installed via the npm install
 *
 */
const
    puppeteer = require('puppeteer'),
    moment = require('moment'),
    utils = require('utils');
    //process = require('process');


/**
 *
 * Global variables, here we are decalring browser and page outside the actual runBot() function
 * this is because we run the function with a .catch and if we want to close the page and browser from the catch,
 * they have to be global. Google 'Javascript EMCAScript 6 scope' for more info on scope (what has access to what)
 *
 */
let browser,
    page;
        

/**
 *
 * The run bot function: this is an ASYNC function, meaning all functions within must complete before the next can go,
 * If the function fails it falls into the catch, which currently calls another function within UTILS, a repo installed from npm install.
 * Holding shift and clicking the 'buildError' function will take you to the function but in essence it just takes an error code defined below and tells you what went wrong in the console.
 *
 */
async function runBot() {

    /**
     *
     * this is where we have our selectors & URL, its up here so if one of them breaks or changes, we dont have to find it in the code,
     * and it looks better.
     *
     */
    let
        jsonInput = {
            URL: "https://www.imdb.com/",
            UNAME: "jameswaltonmk2@gmail.com",
            PASS: "imdbpass1",
        };

    let inputVars = JSON.parse(String(process.argv[2]));
    /**
     *
     *Initialises the puppeteer browser, headless false is a perameter, means it will open a window so you can see what the robot is doing,
     * setting this to true makes it a fully headless browser, just a process. this is how all our robots are ran.
     *
     */
    browser = await puppeteer.launch({headless:false});

    /**
     *
     * opens a tab or page, within the browser
     *
     */
    page = await browser.newPage();


    /**
     *
     * take a guess
     *
     */

    await page.goto(jsonInput.URL).catch((err) => {
        return Promise.reject(utils.buildError("NAVIGATION FAILURE", `${err}`));
    });

    /**
     *
     * using back ticks so we can add variables into comments with ${example} instead of breaking up strings like  + example +
     *
     */
    console.log(`I have arrived at ${await page.url()}, leaving in 5 seconds`);
    await page.waitFor(1000);


    //ToDo At this point we have arrived at the site and we can do whatever we want.
    //ToDo look at the puppeteer docs and try to log into the site.

    //---------------------LOGIN----------------------------------------------------
           
    await page.click('a[id="imdb-signin-link"]');
    await page.waitForNavigation({ waitUntil: 'load' });
    console.log(`I have arrived at ${await page.url()}`);

    await page.click('a.list-group-item:first-of-type');
    await page.waitForSelector('input[id="ap_password"]');
    console.log('filling in login creds.');

    await page.type('input[id="ap_email"]', jsonInput.UNAME);
    await page.type('input[id="ap_password"]', jsonInput.PASS);
    console.log('entered login creds');

    await page.click('input[id="signInSubmit"]');
    console.log('clicked the button');

    await page.waitForSelector('#navWatchlistMenu');
    await page.click('#navWatchlistMenu > p > a');
    console.log('clicked watchlist');


    await page.waitForSelector('.lister-item-header');
    console.log('watchlist items have loaded');

    const titles = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.lister-item-header')).map( title =>
            title.innerText.trim()));

    console.log(titles);

    


    
    /**
     *
     *Closes the page, then the browser, then kills the procecss entirely, we could just kill the process,
     * but to google this would look like our browser just crashed, so closing it all down look more human.
     */
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