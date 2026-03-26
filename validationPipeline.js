const CONFIG = {
// 🔒 Replace with environment variables or keep anonymized
TEAM_ID: 'YOUR_TEAM_ID',
SHEET_NAME: 'TimeTracking',
USER_IDS: [
111111,
222222,
333333
],
INITIAL_START_DATE: '2025-01-01T00:00:00.000Z',
HEADER: [['User', 'Date', 'Hours']],
MAX_PAGES_PER_BATCH: 20,
MAX_ENTRIES_PER_BATCH: 1000,
MAX_EXECUTION_TIME: 240,
API_DELAY: 400,
ENTRIES_PER_PAGE: 100,
CHUNK_SIZE: 50,
MAX_RETRIES: 3,
MEMORY_CLEANUP_INTERVAL: 5,
PROTECTED_COLOR: '#daf0c8'
};
function main() {
const apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
if (!apiKey) {
throw new Error('API key not found. Please configure it in Script Properties.');
}
const startTime = Date.now();
CONFIG.USER_IDS.forEach(userId => {
try {
processUserData(userId, apiKey, startTime);
} catch (error) {
Logger.log('Error processing user');
}
});
}
function processUserData(userId, apiKey, startTime) {
let page = 0;
let totalEntries = 0;
while (page < CONFIG.MAX_PAGES_PER_BATCH) {
if (isExecutionTimeExceeded(startTime)) {
Logger.log('Execution time limit reached');
break;
}
const response = fetchTimeEntries(userId, page, apiKey);

if (!response || !response.data || response.data.length === 0) {
  break;
}

const processedData = transformData(response.data);

writeToSheet(processedData);

totalEntries += processedData.length;

if (totalEntries >= CONFIG.MAX_ENTRIES_PER_BATCH) {
  break;
}

page++;
Utilities.sleep(CONFIG.API_DELAY);

}
}
function fetchTimeEntries(userId, page, apiKey) {
const url = https://api.example.com/time_entries?team_id=${CONFIG.TEAM_ID}&user_id=${userId}&page=${page};
const options = {
method: 'get',
headers: {
Authorization: apiKey
},
muteHttpExceptions: true
};
try {
const response = UrlFetchApp.fetch(url, options);
return JSON.parse(response.getContentText());
} catch (error) {
Logger.log('API request failed');
return null;
}
}
function transformData(data) {
return data.map(entry => {
return [
entry.user || 'Unknown',
formatDate(entry.date),
entry.hours || 0
];
});
}
function writeToSheet(rows) {
const sheet = getOrCreateSheet();
if (sheet.getLastRow() === 0) {
sheet.getRange(1, 1, CONFIG.HEADER.length, CONFIG.HEADER[0].length)
.setValues(CONFIG.HEADER);
}
const startRow = sheet.getLastRow() + 1;
sheet.getRange(startRow, 1, rows.length, rows[0].length)
.setValues(rows);
}
function getOrCreateSheet() {
const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
if (!sheet) {
sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
}
return sheet;
}
function formatDate(dateString) {
const date = new Date(dateString);
return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}
function isExecutionTimeExceeded(startTime) {
const elapsedTime = (Date.now() - startTime) / 1000;
return elapsedTime > CONFIG.MAX_EXECUTION_TIME;
}
