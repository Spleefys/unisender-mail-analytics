# Script for analyzing Unisender mailings/templates on NodeJS
Language: ![https://img.shields.io/badge/NodeJS-14.17.3-blue](https://img.shields.io/badge/NodeJS-14.17.3-blue)

### Description
The NodeJS script is used to get templates and statistics of e-mail campaigns from the service for sending e-mail messages Unisender. Statistics are displayed on the page in the form of a table with the ability to sort by the last date of sending/clicks/reads/complaints. The script was created for email marketers to better understand which templates and mailings are better read/click by users, and which ones receive a large number of complaints and it is better not to send.

### Installation and usage
For get data from Unisender API copy your API key on the page: https://cp.unisender.com/ru/v5/user/info/api

Then paste API key to code on all files where requests to API are executed, like this:
```javascript
xhr2.open("GET", "https://api.unisender.com/ru/api/getTemplates?format=json&api_key=YOUR_API_KEY&limit=100", true);
```
Then change your IP and port on script.js:
```javascript
const host = 'YOUR_IP_HERE'; //ex. 'localhost'
const port = 82; //ex. 80
```
Add folder 'db' to initial folder, there was storage .json files with saved information from Unisender API.

To launch script on VDS with Unix(Linux) use mbash.sh (bash-script what kill other nodejs processes(to kill last start of this script) and start new in the background).

Or if use the Windows or Unix(Linux) just type: ```npm install``` then ```node app.js```

### License
The MIT License (MIT)
![MIT](https://img.shields.io/badge/license-MIT-brightgreen "MIT")

Copyright © 2021 Spleefys