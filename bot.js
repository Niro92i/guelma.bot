const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');

const token = '8794048355:AAGnyWIKoJjW5GCXMuKkcoZi9qe8PlQgQRw';
const chatId = '7591627203';

const bot = new TelegramBot(token);

let alreadySent = false;

async function checkAvailability() {

    console.log("Checking...");

    const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ]
});

    const page = await browser.newPage();

    try {

        await page.goto('https://adhahi.dz/register', {
            waitUntil: 'networkidle2'
        });

        await new Promise(resolve => setTimeout(resolve, 5000));

        const text = await page.evaluate(() => {
            return document.body.innerText;
        });

        // نبحث على قالمة
        const hasGuelma = text.includes('قالمة');

        const unavailable = text.includes('حجز غير متوفر حاليا');

        if (hasGuelma && !unavailable) {

            if (!alreadySent) {

                await bot.sendMessage(
                    chatId,
                    '🚨 قالمة - حجز متوفر !'
                );

                alreadySent = true;
            }

        } else {

            console.log("Still unavailable...");
        }

    } catch (err) {

        console.log(err);
    }

    await browser.close();
}

// كل دقيقة
setInterval(checkAvailability, 15000);

checkAvailability();