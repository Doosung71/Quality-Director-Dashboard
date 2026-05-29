const ADMIN_EMAILS = ["doosung71@gmail.com"]
export const isAdmin = (email?: string | null) => !!email && ADMIN_EMAILS.includes(email)
