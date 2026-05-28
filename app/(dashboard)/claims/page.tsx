import { getClaimsData } from "@/data/claims.data";
import { ClaimsView } from "@/components/claims/claims-view";

export default async function ClaimsPage() {
  const data = await getClaimsData();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">고객 클레임 트래커</h1>
        <p className="text-slate-500">품질 이슈의 접수부터 클로징까지 전체 처리 과정을 관리합니다.</p>
      </div>
      
      <ClaimsView data={data} />
    </div>
  );
}
