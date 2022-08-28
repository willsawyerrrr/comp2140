// Import dependencies using ES Modules (requires "type": "module" in package.json)
import promptSync from "prompt-sync";
const prompt = promptSync({ sigint: false });
import fetch from "node-fetch";
import fs from "fs/promises";

// The main app logic
function main() {
    // Declare global variables
    const numDays = 7;
    const numTop = 3;
    const maxDays = 2;
    const launchURL = "https://api.spacexdata.com/v4/launches/";
    const launchpadURL = "https://api.spacexdata.com/v4/launchpads/";
    const jsonFilename = (append) => `spacex-${append}.json`;

    /**
     * Stringifies a given date format similar to UTC format.
     * @param {string} date a date in UTC format (dd/mm/yyyy)
     * @returns {string} date similar to UTC format
     */
    function dateStringify(date) {
        let month = new String(date.getMonth() + 1).padStart(2, '0');
        let day = new String(date.getDate()).padStart(2, '0');
        return new String(`${date.getFullYear()}-${month}-${day}`);
    }

    /**
     * Returns a new date offset by `days` days from today.
     * @param {number} days a number of days to offset by
     * @returns {Date} offset date
     */
    function addDays(days) {
        let today = new Date();
        today.setDate(today.getDate() + days);
        return today;
    }

    // Declare date global variables
    const today = new Date();
    const todayDate = dateStringify(today);
    const oneDay = addDays(maxDays / 2);
    const oneDayDate = dateStringify(oneDay);
    const twoDay = addDays(maxDays);
    const twoDayDate = dateStringify(twoDay);

    // Declare message global variables
    let messageWelcome = "Welcome to the SpaceX Rocket Launch Checker!";
    let messageExiting = "Exiting. See you next time!";
    let messageInput = `Please enter \x1b[32mtoday\x1b[0m (${todayDate}) or \x1b[32mtomorrow\x1b[0m (${oneDayDate}) or \x1b[32mday after tomorrow\x1b[0m (${twoDayDate}) to return the number of filtered launches for that day: `;
    let messageInputInvalid = "This isn't one of the valid inputs. Please try again.";
    let messageSaveCache = (filenameAppend) => `Saved a JSON cache file called "${jsonFilename(filenameAppend)}".`;
    let messageReadCache = (filenameAppend) => `Read a JSON cache file called "${jsonFilename(filenameAppend)}".`;
    let messageFetching = (dayIndex, daySelected) => `Fetching data for "${dayIndex}" (${daySelected})...`;
    let messageFetchedLive = (dayIndex, daySelected) => `Successfully fetched live data for "${dayIndex}" (${daySelected}) from the API.`;
    let messageFiltered = (input, daySelectedFiltered) => `For the input of \x1b[32m${input}\x1b[0m, the filtered results are: ${daySelectedFiltered}`;

    /**
     * Returns a stringified date corresponding to the user's input.
     * @param {string} input the user's input
     * @returns {string | null} stringified date; `null` if `input` is invalid
     */
    function validateDate(input) {
        switch (input) {
            case "today":
                return todayDate;
            case "tomorrow":
                return oneDayDate;
            case "day after tomorrow":
                return twoDayDate;
            default:
                return null;
        }
    }

    /**
     * Asynchronously fetches data from `url`.
     * @param {string} url the URL to fetch data from
     * @returns {object} the JSON response
     */
    async function fetchData(url) {
        let response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
    }

    /**
     * Fetches launch data and filters the array based on the day.
     * @param {number} day the selected day in date format
     * @returns {Array} sorted array of launches based on `date_unix` and only the same day of the week
     */
    async function filterLaunches(day) {
        const launches = await fetchData(launchURL);
        // filter by success first for efficiency
        let filteredLaunches = launches.filter(launch => launch.success).filter(launch => new Date(launch.date_utc).getDay() == new Date(day).getDay());
        let filteredData = await Promise.all(filteredLaunches.map(async (launch) => {
            let launchpad = await fetchData(launchpadURL + launch.launchpad);
            launch["launchpad"] = launchpad;
            return launch;
        }));

        let sortData = filteredData.slice(0);
        sortData.sort((a, b) => a.date_unix - b.date_unix);
        return sortData;
    }

    /**
     * Populates data from fetched JSON and determine the number of filtered launches for the inputted day.
     * @param {string} input the validated string as inputted by the user
     */
    async function combineFetches(input) {
        let daySelected = validateDate(input);
        let daySelectedFiltered;

        let dataAll = {};
        let dataTop = {};

        // get from cache files
        let dataAllCached = await readCache("all");
        let dataTopCached = await readCache("top");

        if (dataAllCached && dataTopCached) {
            // cache files exist, use them
            dataAll = JSON.parse(dataAllCached);
            dataTop = JSON.parse(dataTopCached);
        } else {
            // cache files don't exist, fetch data

            // Setup base array for all data
            dataAll = {
                "today": [],
                "tomorrow": [],
                "day after tomorrow": []
            };

            // Setup base array for top data
            dataTop = {
                ...dataAll // Spread syntax used to duplicate array contents
            };

            for (let dayIndex in dataAll) {
                // Sorted data and filtered based on the selected day of week
                let dataAllFiltered = await filterLaunches(daySelected);
                console.log(messageFetchedLive(dayIndex, daySelected));
                dataAll[dayIndex] = dataAllFiltered;

                let dataTopFiltered = dataAllFiltered.slice(0, numTop);
                dataTop[dayIndex] = dataTopFiltered;
            }


            // save to cache files
            await saveCache("all", dataAll);
            await saveCache("top", dataTop);
        }

        daySelectedFiltered = dataAll[input].length;
        console.log(messageFiltered(input, daySelectedFiltered));
    }

    /**
     * Saves a JSON cache file with the specified filename & data.
     * @param {string} filenameAppend the string to append to the JSON filename
     * @param {string} data the string containing JSON data to save
     */
    async function saveCache(filenameAppend, data) {
        fs.writeFile(jsonFilename(filenameAppend), JSON.stringify(data, null, 4));
        console.log(messageSaveCache(filenameAppend));
    }

    /**
     * Reads from the JSON cache file with the specified filename.
     * @param {string} filename unique part of the JSON cache file's name
     * @see `jsonFilename` for the use of `filename`
     * @returns {string} the JSON data from the cache file
     */
    async function readCache(filename) {
        let cache = await fs.readFile(jsonFilename(filename));
        console.log(messageReadCache(filename));
        return cache;
    }

    // Synchronous prompt logic
    let day = null;
    let input;
    while (true) {
        console.log(messageWelcome);
        // Prompt the user for input
        input = prompt(messageInput);
        if (input === null) {
            break;
        }
        // Validate against expected inputs
        day = validateDate(input);
        if (day === null) {
            console.log(messageInputInvalid);
        }
        else {
            break;
        }
    }
    if (day === null) {
        console.log(messageExiting);
    }
    else {
        // Run fetches to get data
        combineFetches(input);
    }
}

main();