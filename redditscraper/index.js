const mongoose = require("mongoose");
const cheerio = require("cheerio");
const request = require("request-promise");
const RedditArticle = require("./RedditArticle");

//XQLyTqQ1Asqv8XbO
//redditdbuser
//mongodb+srv://redditdbuser:XQLyTqQ1Asqv8XbO@cluster0-tx7va.mongodb.net/test?retryWrites=true

async function connectToMongoDb() {
    await mongoose.connect("mongodb+srv://redditdbuser:XQLyTqQ1Asqv8XbO@cluster0-tx7va.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
    console.log("connected to mlab!")
}

async function scrapeReddit() {
    const html = await request.get("https://www.reddit.com");
    const $ = await cheerio.load(html);
    const titles = $("h2");

    titles.each(async(i, element) => {
        try {
            const title = $(element).text();
            console.log(title);
            const redditArticle = new RedditArticle({
                title: title
            });
            await redditArticle.save();
        } catch {
            console.error(err);
        }

    });
}

async function main() {
    await connectToMongoDb();
    await scrapeReddit();
}

main()
