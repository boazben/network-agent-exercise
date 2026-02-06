import {
  NETWORK_AGENT_OBJECT_STORE_NAME,
} from "./constants/index-db.constant";
import { getDB } from "./db.service";

export async function getInsights() {
  const db = await getDB();
  const tx = db.transaction(NETWORK_AGENT_OBJECT_STORE_NAME, "readonly");
  const store = tx.objectStore(NETWORK_AGENT_OBJECT_STORE_NAME);

  return await store.getAll();
}
