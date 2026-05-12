import type { FacilityData } from "@/types/facility";
import raw from "./facility.json";

// JSON imports widen literal types (e.g. "gumi" → string), so satisfies can't verify union fields.
// Values are validated against FacilityData shape manually; cast is intentional.
export const facilityData = raw as unknown as FacilityData;
