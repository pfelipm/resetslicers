// Test function for 'Test sheet' →  tries to nullify filtering criteria
function resetSlicerNull() {
  const mySlicer = SpreadsheetApp.getActiveSheet().getSlicers()[0];
  mySlicer.setColumnFilterCriteria(mySlicer.getColumnPosition(), null);
  SpreadsheetApp.flush();
}

// Another test function for 'Test sheet' → gets background color type of slicer
function checkSlicerColor() {
  const mySlicer = SpreadsheetApp.getActiveSheet().getSlicers()[1];
  const colorCss = mySlicer.getBackgroundColor();
  const colorObject = mySlicer.getBackgroundColorObject();
  console.info(colorCss);
  console.info(colorObject);
  console.info(colorObject.getColorType() == SpreadsheetApp.ColorType.RGB ? 'RGB type': 'Not RGB');
  console.info(colorObject.getColorType() == SpreadsheetApp.ColorType.THEME ? 'THEME type':'Not THEME');
  console.info(colorObject.getColorType() == SpreadsheetApp.ColorType.UNSUPPORTED ? 'UNSUPPORTED type':'');

}