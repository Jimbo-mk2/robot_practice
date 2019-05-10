
/**
 *
 * Consts: these are the packages that we are allowing this script to use
 *  the packages are located in 'node modules' and were installed via the npm install
 *
 */
const
    puppeteer = require('puppeteer'),
    utils = require('utils');

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
            URL: "https://www.google.com/"
        };


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

    await page.setViewport({ width: 1280, height: 800 });
    /**
     *
     * using back ticks so we can add variables into comments with ${example} instead of breaking up strings like  + example +
     *
     */
    console.log(`I have arrived at ${await page.url()}, leaving in 5 seconds`);
    await page.waitFor(1000);


    //ToDo At this point we have arrived at the site and we can do whatever we want.
    //ToDo look at the puppeteer docs and try adding code to type something into the search bar, click 'im feeling lucky, and console log the new page url
    

    // ----------------- My Code ------------------------------------


    await page.type(`input[class="gLFyf gsfi"]`, 'blips and chitz');
    page.click(`input[value="I'm Feeling Lucky"]`);
    await page.waitForNavigation({ waitUntil: 'load' });
    console.log(`Here we are, at your lucky site ${await page.url()}.`);

    try {
        await page.waitForSelector(`div[class="_3xSNkKTZcwaNfyU27Wwdzx"]`);
        console.log("Found the cookie consent.")
    }
    catch (err) {
        console.log("Didnt find the cookie consent.");
    }
    
//-------------------------------------------------------------------


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