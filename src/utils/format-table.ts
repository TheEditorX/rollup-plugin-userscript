/**
 * Aligns a 2D array of strings into a formatted table.
 *
 * This function takes a table represented as a 2D array of strings and formats it
 * so that all columns are aligned. It ensures a minimum of 4 spaces between each column.
 *
 * @param table - A 2D array of strings representing the table data.
 * @returns A string with the table formatted for display.
 */
export function formatTable(table: string[][]): string {
  // Return an empty string if the table is empty or has no rows.
  if (!table || table.length === 0) {
    return "";
  }

  // An array to store the maximum width of each column.
  const columnWidths: number[] = [];

  // 1. Determine the maximum width for each column.
  // We iterate through each row and each cell to find the longest string in each column.
  table.forEach((row) => {
    row.forEach((cell, columnIndex) => {
      // If the current column's width is not yet recorded or the current cell is wider,
      // update the maximum width for this column.
      if (
        columnWidths[columnIndex] === undefined ||
        cell.length > columnWidths[columnIndex]
      ) {
        columnWidths[columnIndex] = cell.length;
      }
    });
  });

  // 2. Build the formatted table string.
  // We map over each row to create a formatted string version of it.
  const formattedRows = table.map((row) => {
    // For each cell in the row, we pad it to the calculated column width.
    const formattedCells = row.map((cell, columnIndex) => {
      const width = columnWidths[columnIndex];
      // Use padEnd to add spaces to the right of the cell content.
      // We add 4 extra spaces for the mandatory padding between columns.
      // The last column does not need the extra padding.
      const padding = columnIndex < columnWidths.length - 1 ? 4 : 0;
      return cell.padEnd(width + padding, " ");
    });
    // Join the formatted cells to form a single row string.
    return formattedCells.join("");
  });

  // 3. Join all the formatted rows with newlines to create the final table string.
  return formattedRows.join("\n");
}
