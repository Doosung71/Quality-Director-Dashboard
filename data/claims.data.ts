import { promises as fs } from "fs";
import path from "path";
import type { ClaimsData } from "@/types/claim";

export async function getClaimsData(): Promise<ClaimsData> {
  const filePath = path.join(process.cwd(), "data", "claims.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  return JSON.parse(jsonData);
}
