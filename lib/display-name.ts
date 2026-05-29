export const displayName = (user: { nickname?: string | null; name?: string | null }) =>
  user.nickname?.trim() || user.name?.trim() || "사용자"
