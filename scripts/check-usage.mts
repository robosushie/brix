// Package total, last 7 available days: https://api.npmjs.org/downloads/point/last-week/usebrix
// Daily rows, so the printed range matches the response: https://api.npmjs.org/downloads/range/last-week/usebrix
// Per version, last 7 available days: https://api.npmjs.org/versions/usebrix/last-week
// Package total, last 18 months: https://api.npmjs.org/downloads/point/{start}:{end}/usebrix, with start 18 months before today in UTC. lib/npm-downloads.ts already builds that period in lifetimePeriod().
// Version order: https://registry.npmjs.org/usebrix, time field, newest first, skip non-version keys such as created and modified. Take five.

import { lifetimePeriod } from "../lib/npm-downloads.ts";


const endpoint_lst=[
    "https://api.npmjs.org/downloads/point/last-week/usebrix", // last week total downloads and start and end dates
    "https://api.npmjs.org/versions/usebrix/last-week", // version based no. of downloads
    "https://registry.npmjs.org/usebrix", // lastest version
];



async function usage_check() {
    try{
        // retriving data via the endpoint list
        const retrive= endpoint_lst.map((endpoint) => fetch(endpoint));
        const responses= await Promise.all(retrive);

        const datalst= await Promise.all(responses.map((response) => response.json()));

        // getting last weeks downloads
        const last_5_version_downloads= datalst[1]['downloads'];
        const usage_output=`${datalst[0]['package']}\nLast 7 days\t\t${datalst[0]['start']} - ${datalst[0]['end']}\n\nAll versions\t\t${datalst[0]['downloads']}\n\nLast 5 version`;

        const table_length=`All versions\t\t${datalst[0]['downloads']}`.length;
        
        console.log(usage_output)

        // retriving version based downloads
        for(const [key, val] of Object.entries(last_5_version_downloads)){
            const space_length= table_length - (key.length + String(val).length);

            const p= " ".repeat(space_length+9) ;
            console.log(`${key}${p}${val}`);
        }

        // getting 18 months time period and total download
        const test4=await fetch(`https://api.npmjs.org/downloads/point/${lifetimePeriod()}/usebrix`); // retrive 18 months time period and total download
        const data= await test4.json();

        console.log(`\nLast 18 months:\t\t${data['start']} - ${data['end']}`);
        console.log(` All versions\t\t${data['downloads']}\n\n`)

        // retriving latest version and creation timestamp
        const data5= datalst[2];

        console.log(`npms's newest finished day is ${data5['time'][data5['dist-tags']['latest']]}`);
    }
    catch(error){
        console.log(error);
    }
}

usage_check();