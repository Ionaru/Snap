import { launch } from 'puppeteer';
import * as config from '../config/config.json';

(() => {

    checkForConfigurationErrors();

    for (const website of config.websites) {
        if (website.captureInterval === 0 || website.captureInterval === '0') {
            takeScreenShot(website).then().catch((error) => {
                process.emitWarning(`Capturing screenshot of ${website.url} (${website.width}x${website.height}) failed.`);
                process.emitWarning(error);
            });
        } else {
            setInterval(async () => {
                await takeScreenShot(website).catch((error) => {
                    process.emitWarning(`Capturing screenshot of ${website.url} (${website.width}x${website.height}) failed.`);
                    process.emitWarning(error);
                });
            }, Number(website.captureInterval) * 1000);
        }
    }
})();

async function takeScreenShot(website: IWebsite) {
    let saveName = website.name;
    if (config.uniqueFiles) {
        saveName += `-${Date.now()}`;
    }
    const savePath = `screenshots/${saveName}.png`;
    const browser = await launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setViewport({
        height: Number(website.height),
        width: Number(website.width),
    });
    await page.goto(website.url);
    process.stdout.write(`TAKING SCREENSHOT OF ${website.url} (${website.width}x${website.height}), SAVING TO ${savePath}\n`);
    await page.screenshot({path: savePath});
    await browser.close();
}

function checkForConfigurationErrors() {
    const errorMessage = 'Error in configuration:';

    if (!(typeof config.uniqueFiles === 'boolean')) {
        throw new Error(`${errorMessage} "uniqueFiles" property must be a boolean.`);
    }

    if (!(config.websites && Array.isArray(config.websites) && config.websites.length)) {
        throw new Error(`${errorMessage} "websites" property must be an non-empty array of objects.`);
    }

    for (const website of config.websites) {
        if (!(typeof website === 'object')) {
            throw new Error(`${errorMessage} "websites" property must be an array of objects.`);
        }

        if (!(website.height && !isNaN(Number(website.height)) && website.height > 0)) {
            throw new Error(`${errorMessage} "height" property must be a number greater than 0.`);
        }

        if (!(website.width && !isNaN(Number(website.width)) && website.width > 0)) {
            throw new Error(`${errorMessage} "width" property must be a number greater than 0.`);
        }

        if (!(website.captureInterval !== undefined && !isNaN(Number(website.captureInterval)) && website.captureInterval >= 0)) {
            throw new Error(`${errorMessage} "captureInterval" property must be a number of 0 or greater.`);
        }

        if (!(website.name && website.name.length > 0)) {
            throw new Error(`${errorMessage} "name" property must be a non-empty string.`);
        }

        if (!(website.name && website.url.length > 0)) {
            throw new Error(`${errorMessage} "name" property must be a non-empty string.`);
        }
    }
}
