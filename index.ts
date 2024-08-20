import { listItemWithRetry } from "./utils/listItem";
import { exportFailedItemsToCSV, readCSVFile } from "./utils/readFile";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const lists = await readCSVFile("test-full-version.csv");
  let failedItems: any[] = [];

  if (lists.length > 0) {
    for (let index = 0; index < lists.length; index++) {
      failedItems = await listItemWithRetry(lists[index], failedItems);
      console.log(`#### ${index + 1}/${lists.length} items are listed!`);
      await delay(1000);
    }
    if (failedItems.length > 0) {
      await exportFailedItemsToCSV(failedItems, "failed-items.csv");
    }
  } else {
    console.log("No items to list.");
  }
}

void main();
