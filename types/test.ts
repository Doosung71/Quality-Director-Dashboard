export type TestStatus = '준비중' | '시험중' | '완료' | '지연'
export type SampleType = 'cable' | 'accessory'

export interface TestLog {
  date: string
  note: string
  progress: number
}

export interface Test {
  id: string
  equipmentId: string
  projectName: string
  sampleType: SampleType
  sampleDescription: string
  plannedStart: string
  plannedEnd: string
  actualStart: string | null
  actualEnd: string | null
  status: TestStatus
  progress: number
  logs: TestLog[]
}

export interface TestsData {
  _meta: { version: string; lastUpdated: string; note: string }
  tests: Test[]
}
