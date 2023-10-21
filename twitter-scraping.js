// Twitter scraping code

const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// Define the Twitter account schema
const twitterAccountSchema = new mongoose.Schema({
  username: String,
  followers: Number,
  tweets: Number,
});

// Create the Twitter account model
const TwitterAccount = mongoose.model('TwitterAccount', twitterAccountSchema);

/**
 * Function to scrape 100 Twitter accounts and store the data in a database
 */
async function scrapeTwitterAccounts() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect('mongodb://localhost/twitter_accounts', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');

    // Scrape the Twitter accounts
    const accounts = await scrapeAccounts();

    // Save the accounts to the database
    await TwitterAccount.insertMany(accounts);
    console.log('Data saved to the database');

    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from the database');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * Function to scrape 100 Twitter accounts
 * @returns {Array} Array of Twitter account objects
 */
async function scrapeAccounts() {
  try {
    const accounts = [];

    // Scrape 100 Twitter accounts
    for (let i = 1; i <= 100; i++) {
      const url = `https://twitter.com/account${i}`;

      // Make a GET request to the Twitter account page
      const response = await axios.get(url);

      // Parse the HTML response using Cheerio
      const $ = cheerio.load(response.data);

      // Extract the username, followers count, and tweets count
      const username = $('.username').text();
      const followersCount = parseInt($('.followers-count').text());
      const tweetsCount = parseInt($('.tweets-count').text());

      // Create a Twitter account object
      const account = {
        username,
        followers: followersCount,
        tweets: tweetsCount,
      };

      // Add the account to the accounts array
      accounts.push(account);
    }

    return accounts;
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

// Call the scrapeTwitterAccounts function to start the scraping process
scrapeTwitterAccounts();
// Call the scrapeTwitterAccounts function to start the scraping process
scrapeTwitterAccounts();
