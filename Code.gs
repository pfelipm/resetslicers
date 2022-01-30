/**
 * Resets all slicers in the active sheet using the Apps Script Spreadsheet Service.
 * 
 * Context:
 * 
 * Calling setColumnFilterCriteria(columnPosition, null) or trying to modify
 * in some other way the current filtering criteria of a slicer whose criteria
 * has already been set manually (using the GUI) won't have any effect.
 * So, this function clones & deletes all slicers, instead.
 * 
 * ⚠️ Limitation: Size cannot be programmatically set, at this moment.
 * 
 * Pablo Felip (@pfelipm)
 * 
 * @OnlyCurrentDoc
 */
function resetSheetSlicers() {

  try {

    const s = SpreadsheetApp.getActiveSheet();
    const oldSlicers = s.getSlicers();

    SpreadsheetApp.getActive().toast('All slicers in the active sheet will be reset.', '🤖 Reset Slicers says:', -1);

    // 1. Get array of params of all slicers
    const params = oldSlicers.map(oldSlicer => {

      // Get configuration of a single slicer
      return {
        columnPosition: oldSlicer.getColumnPosition(),
        containerInfo: oldSlicer.getContainerInfo(),
        range: oldSlicer.getRange(),
        title: oldSlicer.getTitle(),
        titleHorizontalAlignment: oldSlicer.getTitleHorizontalAlignment(),
        titleTextStyle: oldSlicer.getTitleTextStyle(),
        backgroundColor: oldSlicer.getBackgroundColorObject(),
        pivot: oldSlicer.isAppliedToPivotTables()
      };
    });

    // 2. Remove old slicers, needs to be done BEFORE creating the new ones, otherwise they will (surprise!) inherit filter criteria!
    oldSlicers.forEach(oldSlicer => oldSlicer.remove());

    // 3. Create new instances of all slicers
    params.forEach(slicerParams => {
      const newSlicer = s.insertSlicer(slicerParams.range, // range is only really needed for the first new slicer
        slicerParams.containerInfo.getAnchorRow(),
        slicerParams.containerInfo.getAnchorColumn(),
        slicerParams.containerInfo.getOffsetX(),
        slicerParams.containerInfo.getOffsetY());

      // Clone settings
      newSlicer.setTitle(slicerParams.title)
        .setTitleHorizontalAlignment(slicerParams.titleHorizontalAlignment)
        .setTitleTextStyle(slicerParams.titleTextStyle)
        .setApplyToPivotTables(slicerParams.pivot);

      // Apply background color only when of a known type (not default), otherwise throws exception
      if (slicerParams.backgroundColor.getColorType() == SpreadsheetApp.ColorType.RGB ||
        slicerParams.backgroundColor.getColorType() == SpreadsheetApp.ColorType.THEME) {
        newSlicer.setBackgroundColorObject(slicerParams.backgroundColor);
      }

      // Set slicer filter criteria so that it shows everything
      newSlicer.setColumnFilterCriteria(slicerParams.columnPosition, SpreadsheetApp.newFilterCriteria().whenFormulaSatisfied('=true')) // hack1: set column and filter to show all rows...
        .setColumnFilterCriteria(slicerParams.columnPosition, null);  // hack2: ...then reset filter

    });

    SpreadsheetApp.getActive().toast('Process completed.', '🤖 Reset Slicers says:');

  } catch (e) {
    SpreadsheetApp.getActive().toast(`⚠️ Oops:\n${e.message}.`, '🤖 Reset Slicers says:', -1);
    console.error(e);
  }

}