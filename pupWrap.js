const _ = require('lodash'),
    utils = require('utils');

let waitThenClickTimeout = 120000,
    waitThenTypeTimeout = 120000,
    waitForSelectorTimeout = 10000,
    xPathWaitThenClickTimeout = 10000,
    xPathWaitTimeout = 10000,
    xPathWaitGetValueTimeout = 2000;

exports.timeoutOverride = async (newTimeouts) => {
    _.forEach(newTimeouts, function(value, key) {
        if (key === 'waitThenClickTimeout') {
            waitThenClickTimeout = value;
        } else if (key === 'waitThenTypeTimeout') {
            waitThenTypeTimeout = value;
        } else if (key === 'waitForSelectorTimeout') {
            waitForSelectorTimeout = value;
        } else if (key === 'xPathWaitThenClickTimeout') {
            xPathWaitThenClickTimeout = value;
        } else if (key === 'xPathWaitTimeout') {
            xPathWaitTimeout = value;
        } else if (key === 'xPathWaitGetValueTimeout') {
            xPathWaitGetValueTimeout = value;
        }
    });
};

exports.resetDefaultTimeouts = async () => {
    waitThenClickTimeout = 120000;
    waitThenTypeTimeout = 120000;
    waitForSelectorTimeout = 10000;
    xPathWaitThenClickTimeout = 10000;
    xPathWaitTimeout = 10000;
    xPathWaitGetValueTimeout = 2000;
};

exports.navigate = async (page, url) => {
    await page.goto(url).catch((err) => {
        return page.goto(url).catch((err) => {
            return true
        });
    });
};

exports.waitThenClick = async (page, selector, description, options) => {
    console.log("waitThenClick");
    if (_.isUndefined(options)) {
        await page.waitFor(selector, {timeout: waitThenClickTimeout}).catch((e) => {
            return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Timeout exceeded for selector - ${description}`));
        });
        return await page.click(selector).catch((e) => {
            return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Failed to click selector - ${description}`));
        })
    } else {
        return await page.waitFor(selector, {timeout: waitThenClickTimeout}).then( async (e) => {
            return await page.click(selector).then( async (e) => {
                return true;
            }).catch((e) => {
                return false;
            })
        }).catch((e) => {
            return false;
        });
    }
};

exports.waitThenType = async (page, selector, string, description) => {
    console.log("waitThenType");
    await page.waitFor(selector, {timeout: waitThenTypeTimeout}).catch((e) => {
        return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Timeout exceeded for selector - ${e}`));
    });
    await page.type(selector, string, {noMisType:1}).catch((e) => {
        return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Failed to click selector - ${e}`));
    })
};

exports.waitForSelector = async (page, selector, description, options) => {
    console.log("waitForSelector");
    if (_.isUndefined(options)) {
        return await page.waitForSelector(selector, {timeout: waitForSelectorTimeout}).catch((e) => {
            return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Timeout exceeded for selector - ${description}`));
        });
    } else {
        return await page.waitForSelector(selector, {timeout: waitForSelectorTimeout}).catch((e) => {
            return false;
        });
    }
};

exports.evaluate = async (page, selector, description, options) => {
    console.log("evaluate");
    await utils.inject(page);
    if (_.isUndefined(options)) {
        return await page.evaluate((selector) => {
            return jq(selector).text().trim();
        }, selector).catch(e => {
            return Promise.reject(utils.buildError("EVAL_FAILURE", `Timeout exceeded for evaluate - ${description}`));
        });
    } else {
        let value = options.value;
        return await page.evaluate((selector, value) => {
            return jq(selector).val() === value;
        }, selector, value).catch(e => {
            return Promise.reject(utils.buildError("EVAL_FAILURE", `Timeout exceeded for evaluate - ${description}`));
        });
    }
};

exports.xPathWaitThenClick = async (page, selector, description) => {
    console.log("xPathWaitThenClick");
    await page.waitForXPath(selector, {timeout: xPathWaitThenClickTimeout}).catch((e) => {
        return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Timeout exceeded for selector - ${description}${e}`));
    });
    let xPath = await page.$x(selector).catch((e) => {
        return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Timeout exceeded for selector - ${description} ${e}`));
    });
    if (_.isUndefined(xPath[0])) {
        return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Is undefined - ${description}`));
    } else {
        await xPath[0].click().catch((e) => {
            return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Timeout exceeded for selector - ${description} ${e}`));
        });
    }
};

exports.xPathWait = async (page, selector, description, options) => {
    console.log("xPathWait");
    if (_.isUndefined(options)) {
        await page.waitForXPath(selector, {timeout: xPathWaitTimeout}).catch((e) => {
            return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Timeout exceeded for selector - ${description}`));
        });
    } else {
        return await page.waitForXPath(selector, {timeout: xPathWaitTimeout}).catch((e) => {
            return false;
        });
    }
};

exports.xPathWaitGetValue = async (page, selector, description, options) => {
    console.log("xPathWaitGetValue");
    if (_.isUndefined(options)) {
        await page.waitForXPath(selector, {timeout: xPathWaitGetValueTimeout}).catch((e) => {
            return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Timeout exceeded for selector - ${description}`));
        });
        return await page.$x(selector).catch((e) => {
            return Promise.reject(utils.buildError("SELECTOR_FAILURE", `Timeout exceeded for selector - ${description}`));
        });
    } else {
        await page.waitForXPath(selector, {timeout: xPathWaitGetValueTimeout}).catch((e) => {
            return false;
        });
        return await page.$x(selector).catch((e) => {
            return false;
        });
    }
};

