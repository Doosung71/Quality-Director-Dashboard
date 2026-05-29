import type { ClaimsData } from "@/types/claim";
import raw from "./claims.json";

// JSON imports widen literal types, so satisfies can't verify union fields.
// Values are validated against ClaimsData shape manually; cast is intentional.
export const claimsData = raw as unknown as ClaimsData;
