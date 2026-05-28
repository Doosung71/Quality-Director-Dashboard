export type ClaimStatus = "Received" | "Investigating" | "Action" | "Verification" | "Closed";
export type ClaimPriority = "Low" | "Mid" | "High";

export interface ClaimTimelineItem {
  date: string;
  action: string;
}

export interface Claim {
  id: string;
  title: string;
  customer: string;
  priority: ClaimPriority;
  status: ClaimStatus;
  receivedAt: string;
  assignee: string;
  description: string;
  timeline?: ClaimTimelineItem[];
}

export interface ClaimsData {
  claims: Claim[];
}
