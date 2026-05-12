export type SiteId = "gumi" | "donghae";
export type HallStatus = "가동중" | "건축중";
export type EquipmentStatus = "new" | "normal" | "aging" | "planned";

export interface Site {
  id: SiteId;
  name: string;
  fullName: string;
  country: string;
}

export interface TestHall {
  id: string;
  siteId: SiteId;
  name: string;
  type: string;
  purpose: string;
  status: HallStatus;
  dimensions: { length: number | null; width: number | null; height: number | null; area: number | null };
}

export interface TestYard {
  id: string;
  siteId: SiteId;
  name: string;
  type: string;
  purpose: string;
  status: HallStatus;
  dimensions: { length: number | null; width: number | null; area: number | null };
}

export interface Equipment {
  id: string;
  hallId?: string;
  yardId?: string;
  siteId: SiteId;
  name: string;
  type: string;
  spec: Record<string, string>;
  maker: string;
  makerCountry: string | null;
  yearIntroduced: number;
  quantity: number;
  status: EquipmentStatus;
  replacedBy: string | null;
  replaces: string | null;
  notes: string;
}

export interface FacilityData {
  sites: Site[];
  testHalls: TestHall[];
  testYards: TestYard[];
  equipment: Equipment[];
}
