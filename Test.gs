// Test function 1 →  tries to nullify filtering criteria of first slicer in 'Test' sheet
function resetSlicerNull() {
  const mySlicer = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Test').getSlicers()[0];
  mySlicer.setColumnFilterCriteria(mySlicer.getColumnPosition(), null);
  SpreadsheetApp.flush();
}

// Test function 2 → gets background color/type of first slicer in 'Test' sheet
function checkSlicerColor() {
  const mySlicer = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Test').getSlicers()[0];
  const colorCss = mySlicer.getBackgroundColor();
  const colorObject = mySlicer.getBackgroundColorObject();
  console.info(colorCss);
  console.info(colorObject);
  console.info(colorObject.getColorType() == SpreadsheetApp.ColorType.RGB ? 'RGB type': 'Not RGB');
  console.info(colorObject.getColorType() == SpreadsheetApp.ColorType.THEME ? 'THEME type':'Not THEME');
  console.info(colorObject.getColorType() == SpreadsheetApp.ColorType.UNSUPPORTED ? 'UNSUPPORTED type':'');

}

// Test function 3 → creates slicer in 'Test' sheet and gets its background color/type
function createCheckSlicerColor() {
  const mySlicer = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Test').insertSlicer(SpreadsheetApp.getActiveSheet().getRange('A10:B20'),10,1);
  const colorCss = mySlicer.getBackgroundColor();
  const colorObject = mySlicer.getBackgroundColorObject();
  console.info(colorCss);
  console.info(colorObject);
  console.info(colorObject.getColorType() == SpreadsheetApp.ColorType.RGB ? 'RGB type': 'Not RGB');
  console.info(colorObject.getColorType() == SpreadsheetApp.ColorType.THEME ? 'THEME type':'Not THEME');
  console.info(colorObject.getColorType() == SpreadsheetApp.ColorType.UNSUPPORTED ? 'UNSUPPORTED type':'');

}