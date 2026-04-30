import rawData from "../../../db.json";
import type { Account,Movement  } from "../../types/models";

export const accounts: Account[] = rawData.accounts as Account[];
export const movements: Movement[] = rawData.movements as Movement[];