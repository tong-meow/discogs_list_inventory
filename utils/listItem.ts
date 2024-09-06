import axios from "axios";

import { DISCOGS_CONFIG } from "../discogs_config";
import { delay } from "..";

const DISCOGS_API_URL = DISCOGS_CONFIG.DISCOGS_API_URL;
const DISCOGS_USER_AGENT = DISCOGS_CONFIG.DISCOGS_USER_AGENT;
const DISCOGS_TOKEN = DISCOGS_CONFIG.DISCOGS_TOKEN;

export async function listItemWithRetry(
  item: any,
  failedItems: any[],
  retries = 3
): Promise<any[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await listItemOnMarketplace(item);
      console.log(`Item listed successfully: ${item.release_id}`);
      return failedItems;
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 60000;
        console.log(
          `Rate limit exceeded. Waiting for ${
            waitTime / 1000
          } seconds... (Attempt ${attempt} of ${retries})`
        );
        await delay(waitTime);
      } else {
        console.error(
          `Error listing item ${item.release_id}:`,
          error.response ? error.response.data : error.message
        );
        break;
      }
    }
  }
  console.log(
    `Failed to list item ${item.release_id} after ${retries} attempts.`
  );
  failedItems.push(item);

  return failedItems;
}

export async function listItemOnMarketplace(item: any) {
  try {
    const response = await axios.post(
      `${DISCOGS_API_URL}/marketplace/listings`,
      {
        release_id: item.release_id,
        condition: item.condition,
        sleeve_condition: item.sleeve_condition,
        price: item.price,
        status: "For Sale",
        comments: item.comments,
      },
      {
        headers: {
          "User-Agent": DISCOGS_USER_AGENT,
          Authorization: `Discogs token=${DISCOGS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Item listed successfully:", response.data);
  } catch (error) {
    console.error("Error listing item:", error);
  }
}
