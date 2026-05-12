import { facilityData } from "@/data/facility.data";
import { testsData } from "@/data/tests.data";
import { FacilitiesView } from "@/components/facilities/facilities-view";

export default function FacilitiesPage() {
  return (
    <div className="space-y-1">
      <h1 className="text-lg font-semibold text-slate-800">시험장·시험 현황</h1>
      <p className="text-xs text-slate-400 mb-4">구미·동해 시험장 및 주요 시험설비 현황 (2026.03 기준)</p>
      <FacilitiesView
        data={facilityData}
        testsData={testsData}
      />
    </div>
  );
}
