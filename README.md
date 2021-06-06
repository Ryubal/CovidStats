# 🤖 CovidStats (Discord bot)
CovidStats is a Discord bot built with Discord.js, that provides with basic worldwide COVID statistics

## Requirements
- NodeJS (developed with v12.17.0)
- Discord bot token (added to the channel of your liking)

## Getting started
1. Clone this repo `git clone https://github.com/Ryubal/CovidStats`
2. Rename the `config.txt` file to `config.json`
3. Open the `config.json` file with your preferred editor, and set your Discord Bot `token`
4. Install dependencies `npm install`
4. 🚀 Run! `node index.js`

## Usage
The main idea of this bot is to get basic COVID statistics pretty quickly, about a particular country. Below is a description of available commands.

`!covid all`
> Returns all COVID statistics.

> 🚨 Disabled for now! We need to figure out how to condense +30 countries.

`!covid countries`
> Returns a list of available countries

`!covid [COUNTRY]`
> Returns COVID statistics about **country**. Example: `!covid united states`

## Details
This project was created using NodeJS (with the Discord.js library). COVID information is gathered from [Apify](https://apify.com/covid-19)

## Future plans
This bot is in its early stages. Right now it's stable, but very simple. Below are some of the features that I'd like to add in the very next weeks:
- More useful COVID-related commands. Stats, graphs, health information, etc.
- Translation, at least to spanish for now.
- Ability to configure bot with commands (default language, default country, stats every N minutes)

## Contributing
Contributions are very welcome! Here's how:
1. [Fork this repo](https://github.com/ryubal/CovidStats/fork) 🍴
2. Clone your fork `git clone https://github.com/YOUR-USERNAME/covidstats.git`
3. Create your feature branch `git checkout -b MY-FEATURE-NAME`
4. Commit your changes `git commit -m 'MY FEATURE DESCRIPTION'
5. Push to the branch `git push origin MY-FEATURE-NAME`
6. Submit a pull request! 🔌
