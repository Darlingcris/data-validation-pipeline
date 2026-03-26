/**
Data Validation & Automation Pipeline
Author: [Your Name]
Description:
End-to-end automation for validating time tracking data between systems
using Google Apps Script, ClickUp API, and Google Sheets.
*/
/****************************************************************
GLOBAL CONFIGURATION (SANITIZED)
****************************************************************/
const CONFIG = {
TEAM_ID: 'YOUR_TEAM_ID', // 🔒 replace with environment variable if needed
SHEET_NAME: 'TimeTracking',
USER_IDS: [
10001,
10002,
10003
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
/****************************************************************
VALIDATION CONFIGURATION
****************************************************************/
const VALIDATION_CONFIG = {
headerRow: 2,
dataStartRow: 4,
employeeNameColumn: 2,
exceptionsSheet: "Exceptions",
validationOptions: [
"⚠️ Warning",
"✅ Valid",
"🔖 Review",
"🤔 Confirm",
"🏖️ TimeOff",
"🚨 Error",
"⏰ MissingHours",
"📝 Pending",
"🎉 Holiday"
]
};
/****************************************************************
CORE VALIDATION LOGIC
****************************************************************/
function runValidation() {
const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const selection = sheet.getActiveRange();
if (!selection || selection.getRow() !== 1) {
throw new Error('Select date columns in row 1.');
}
const selectedColumns = [];
for (let i = 1; i <= selection.getNumColumns(); i++) {
selectedColumns.push(selection.getColumn() + i + 1);
}
const lastRow = sheet.getLastRow();
const lastCol = sheet.getLastColumn();
if (lastRow < VALIDATION_CONFIG.dataStartRow) return;
const data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
for (let row = VALIDATION_CONFIG.dataStartRow - 1; row < lastRow; row++) {
for (const col of selectedColumns) {
const index = col - 1;
 const clickupHours = parseFloat(data[row][index - 2]) || 0;
  const dashboardHours = parseFloat(data[row][index - 1]) || 0;

  let result = "⚠️";

  if (clickupHours === dashboardHours && clickupHours >= 7.5) {
    result = "✅";
  } else if (clickupHours === 0 && dashboardHours === 0) {
    result = "⚠️";
  }

  sheet.getRange(row + 1, col).setValue(result);
}

}
}
/****************************************************************
EXTERNAL API INTEGRATION (SANITIZED)
****************************************************************/
function fetchTimeEntries(userId, startDate, endDate) {
const apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
const url = https://api.example.com/time_entries;
const options = {
method: 'get',
headers: {
Authorization: apiKey
}
};
try {
const response = UrlFetchApp.fetch(url, options);
return JSON.parse(response.getContentText());
} catch (error) {
Logger.log('API error');
return [];
}
}
/****************************************************************
DATA PROCESSING
****************************************************************/
function transformEntries(entries) {
return entries.map(entry => {
return [
entry.user || 'Unknown',
new Date(entry.date),
entry.hours || 0
];
});
}
/****************************************************************
WRITE TO SHEET
****************************************************************/
function writeData(rows) {
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
const startRow = sheet.getLastRow() + 1;
sheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
}

/**
Data Validation & Automation Pipeline

Demonstrates:
API integration
Data validation logic
Spreadsheet automation
Batch processing concept
*/
/****************************************************************
CONFIGURATION (SANITIZED)
****************************************************************/
const CONFIG = {
SHEET_NAME: 'TimeTracking',
MIN_EXPECTED_HOURS: 7.5
};
/****************************************************************
VALIDATION LOGIC
****************************************************************/
function validateTimeData() {
const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const data = sheet.getDataRange().getValues();
if (data.length < 2) return;
for (let i = 1; i < data.length; i++) {
const clickupHours = Number(data[i][1]) || 0;
const dashboardHours = Number(data[i][2]) || 0;
let status = "⚠️ Warning";

if (clickupHours === dashboardHours && clickupHours >= CONFIG.MIN_EXPECTED_HOURS) {
  status = "✅ Valid";
} else if (clickupHours === 0 && dashboardHours === 0) {
  status = "⚠️ No Data";
}

sheet.getRange(i + 1, 4).setValue(status);

}
}
/****************************************************************
MOCK API (SAFE FOR PORTFOLIO)
****************************************************************/
function fetchMockTimeEntries() {
return [
{ user: "User A", date: "2025-01-01", hours: 8 },
{ user: "User B", date: "2025-01-01", hours: 6 }
];
}
/****************************************************************
DATA TRANSFORMATION
****************************************************************/
function transformData(entries) {
return entries.map(e => [
e.user,
new Date(e.date),
e.hours
]);
}
/****************************************************************
WRITE TO SHEET
****************************************************************/
function writeDataToSheet() {
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
const entries = fetchMockTimeEntries();
const rows = transformData(entries);
sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length)
.setValues(rows);
}

/**
Time Tracking Reminder System (Sanitized Version)

Portfolio-safe version with:
No sensitive URLs
Generic naming
Clean structure
*/
/****************************************************************
UI FUNCTION
****************************************************************/
function showDateDialog() {
const html = HtmlService
.createHtmlOutputFromFile('dialog_select_dates')
.setWidth(350)
.setHeight(210);
SpreadsheetApp.getUi().showModalDialog(html, 'Select up to 3 dates');
}
/****************************************************************
MAIN LOGIC
****************************************************************/
function processPendingTimeEntries(selectedDates) {
const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const headerDates = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
const subHeaders = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
const usernameIndex = subHeaders.indexOf('Username');
if (usernameIndex === -1) {
SpreadsheetApp.getUi().alert('Error: "Username" column not found.');
return;
}
const usernameCol = usernameIndex + 1;
selectedDates = selectedDates.filter(Boolean);
if (selectedDates.length === 0) return;
const pendingByDate = {};
const targetColumns = [];
selectedDates.forEach(date => {
const formatted = formatDate(date);
const colIndex = headerDates.indexOf(formatted);
if (colIndex !== -1) {
  const statusCol = colIndex + 3;
  targetColumns.push({ col: statusCol, date, formatted });
}

});
if (targetColumns.length === 0) return;
const numRows = sheet.getLastRow() - 3;
if (numRows <= 0) return;
const users = sheet.getRange(4, usernameCol, numRows, 1).getValues();
for (let i = 0; i < numRows; i++) {
const user = users[i][0];
if (!user) continue;
targetColumns.forEach(item => {
  const status = sheet.getRange(i + 4, item.col).getValue();

  if (status === 'PENDING') {
    const userId = getUserId(user);

    if (userId) {
      if (!pendingByDate[item.formatted]) {
        pendingByDate[item.formatted] = [];
      }
      pendingByDate[item.formatted].push(userId);
    }
  }
});

}
Object.keys(pendingByDate).forEach(date => {
const ids = pendingByDate[date];
if (ids.length > 0) {
  sendBatchNotification(date, ids);
}

});
}
/****************************************************************
MOCK NOTIFICATION (SAFE)
****************************************************************/
function sendBatchNotification(date, userIds) {
Logger.log(Mock notification sent for ${date} to ${userIds.length} users.);
}
/****************************************************************
HELPERS
****************************************************************/
function getUserId(name) {
const sheet = SpreadsheetApp
.getActiveSpreadsheet()
.getSheetByName('User Mapping');
if (!sheet) return null;
const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
for (let i = 0; i < data.length; i++) {
if (data[i][0] === name) {
return data[i][1];
}
}
return null;
}
function formatDate(dateISO) {
if (!dateISO || typeof dateISO !== 'string') return '';
const parts = dateISO.split('-');
return parts.length === 3
? ${parts[2]}/${parts[1]}/${parts[0]}
: dateISO;
}


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
