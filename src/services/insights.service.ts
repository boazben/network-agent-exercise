import { openDB } from "idb";
import {
  NETWORK_AGENT_INDEXED_DB_NAME,
  NETWORK_AGENT_INDEXED_DB_VERSION,
  NETWORK_AGENT_OBJECT_STORE_NAME,
} from "./constants/index-db.constant";

export async function getInsights() {
  const db = await openDB(
    NETWORK_AGENT_INDEXED_DB_NAME,
    NETWORK_AGENT_INDEXED_DB_VERSION,
  );
  const tx = db.transaction(NETWORK_AGENT_OBJECT_STORE_NAME, "readonly");
  const store = tx.objectStore(NETWORK_AGENT_OBJECT_STORE_NAME);

  return await store.getAll();
}
