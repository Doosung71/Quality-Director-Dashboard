import type { TestsData } from "@/types/test";
import raw from "./tests.json";

// JSON imports widen literal types (e.g. "cable" → string), so satisfies can't verify union fields.
// Values are validated against TestsData shape manually; cast is intentional.
export const testsData = raw as unknown as TestsData;
