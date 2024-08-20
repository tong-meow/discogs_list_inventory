import * as fs from "fs";
import csv from "csv-parser";
import csvWriter from "fast-csv";
import { List } from "./types";

interface DataObject {
  [key: string]: string;
}

export function readCSVFile(filePath: string): Promise<List[]> {
  return new Promise((resolve, reject) => {
    const results: List[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: DataObject) => {
        const listing: List = {
          release_id: parseInt(data.release_id, 10),
          condition: data.media_condition,
          price: parseFloat(data.price),
          comments: data.comments,
          allow_offers: false,
          status: "For Sale",
          sleeve_condition: data.sleeve_condition,
          location: data.location,
          external_id: data.external_id,
          weight: data.weight ? parseInt(data.weight, 10) : undefined,
          format_quantity: data.format_quantity
            ? parseInt(data.format_quantity, 10)
            : undefined,
        };

        results.push(listing);
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

export async function exportFailedItemsToCSV(
  failedItems: any[],
  filePath: string
) {
  const ws = fs.createWriteStream(filePath);
  csvWriter
    .write(failedItems, { headers: true })
    .pipe(ws)
    .on("finish", () => {
      console.log(`Failed items exported to ${filePath}`);
    });
}
