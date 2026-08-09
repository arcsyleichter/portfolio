import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/builder/auth";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
