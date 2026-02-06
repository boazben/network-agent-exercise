import { openDB, type IDBPDatabase,  } from "idb";
import {
  NETWORK_AGENT_INDEXED_DB_NAME,
  NETWORK_AGENT_INDEXED_DB_VERSION,
  NETWORK_AGENT_OBJECT_STORE_NAME,
} from "./constants/index-db.constant";

export async function getDB(): Promise<IDBPDatabase> {
  return openDB(
    NETWORK_AGENT_INDEXED_DB_NAME,
    NETWORK_AGENT_INDEXED_DB_VERSION,
    {
      upgrade(db) {
        if (!db.objectStoreNames.contains(NETWORK_AGENT_OBJECT_STORE_NAME)) {
          db.createObjectStore(NETWORK_AGENT_OBJECT_STORE_NAME, { keyPath: "url" });
        }
      },
    }
  );
}