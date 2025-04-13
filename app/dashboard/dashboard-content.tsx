"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
const DashboardContent = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleCreateBusiness = async () => {
    await fetch("/api/dashboard", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Business",
      }),
    });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{session?.user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleCreateBusiness}>Create Business</button>
    </div>
  );
};

export default DashboardContent;
