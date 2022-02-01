/**
 * Resets all slicers in the active sheet using the Sheets API/advanced service.
 *
 * Context:
 * 
 *    - filterCriteria is not updated when adjustments have been applied through the GUI.
 *    - Neither the Spreadsheet Service nor the Sheets v4 API/advanced service can access
 *      or modify the current filtering criteria of a slicer whose criteria has already been
 *      set manually (using the GUI).
 *    - The plain SpreadSheet Service cannnot access the width and height properties of a slicer.
 * 
 * So, this functions clones & deletes all slicers instead using the Sheets V4 API via its advanced service,
 * which turns out to be *much* faster than using the SpreadSheet Service and can adjust the width and height
 * of any slicer.
 *  
 * Pablo Felip (@pfelipm)
 * 
 * @OnlyCurrentDoc
 */
function resetSheetSlicersApi() {

  try {

    const ssId = SpreadsheetApp.getActive().getId();
    const sId = SpreadsheetApp.getActiveSheet().getSheetId();

    // 1. Get config information about all slicers in the active sheet
    const oldSlicers = Sheets.Spreadsheets.get(ssId).sheets.find(sheet => sheet.properties.sheetId == sId).slicers;

    // 2. Removes all slicers in the active sheet
    SpreadsheetApp.getActiveSheet().getSlicers().forEach(slicer => slicer.remove());
    SpreadsheetApp.flush(); // Mandatory, otherwise new settings do not apply

    // 3. Prepare a Sheets V4 API batch request to create new instances of all slicers
    const newSlicersRequest = [];
    oldSlicers.forEach(newSlicer => {
      newSlicer.slicerId = undefined; // new slicer
      newSlicer.spec.filterCriteria = undefined; // only needed when filterCriteria has been set programmatically, otherwise this field is ignored, anyway
      newSlicersRequest.push({ "addSlicer": { "slicer": newSlicer } })

    });

    // Create new slicers!
    Sheets.Spreadsheets.batchUpdate({ 'requests': newSlicersRequest }, ssId);
  
  } catch (e) {
    SpreadsheetApp.getActive().toast(`⚠️ Oops:\n${e.message}.`, '🤖 Reset Slicers says:', -1);
    console.error(e);
  }

}