import { GoogleSpreadsheet, type GoogleSpreadsheetRow } from "google-spreadsheet"
import { JWT } from "google-auth-library"

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n")

if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
  throw new Error("Missing required environment variables for Google Sheets")
}

let doc: GoogleSpreadsheet

async function getAuthToken() {
  const scopes = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive.file"]

  return new JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes,
  })
}

async function initializeDoc() {
  try {
    const authToken = await getAuthToken()
    const newDoc = new GoogleSpreadsheet(SPREADSHEET_ID, authToken)
    await newDoc.loadInfo()
    console.log("Spreadsheet loaded successfully")
    return newDoc
  } catch (error) {
    console.error("Error initializing document:", error)
    throw error
  }
}

async function getDoc() {
  if (!doc) {
    doc = await initializeDoc()
  }
  return doc
}

export async function saveSectionData(email: string, sectionName: string, data: any) {
  try {
    console.log(`Attempting to save data for ${email} in section ${sectionName}`)
    const doc = await getDoc()
    const sheet = doc.sheetsByTitle["Survey Responses"]
    if (!sheet) {
      console.error("Survey Responses sheet not found")
      throw new Error("Survey Responses sheet not found")
    }

    const timestamp = new Date().toISOString()
    const rowData = {
      Email: email,
      Section: sectionName,
      Timestamp: timestamp,
      Data: JSON.stringify(data),
    }

    await sheet.addRow(rowData)
    console.log(`Data saved successfully for ${email} in section ${sectionName}`)
  } catch (error) {
    console.error("Error in saveSectionData:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to save data: ${error.message}`)
    } else {
      throw new Error("An unknown error occurred while saving data")
    }
  }
}

export async function getRows(sheetName: string): Promise<GoogleSpreadsheetRow[]> {
  try {
    const doc = await getDoc()
    const sheet = doc.sheetsByTitle[sheetName]
    if (!sheet) {
      console.error(`Sheet "${sheetName}" not found`)
      throw new Error(`Sheet "${sheetName}" not found`)
    }
    const rows = await sheet.getRows()
    return rows
  } catch (error) {
    console.error("Error in getRows:", error)
    throw error
  }
}

