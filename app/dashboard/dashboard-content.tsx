"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { User, Business } from "@/db/schema";
import { BusinessDialog } from "./components/BusinessDialog/BusinessDialog";
import { DashboardSkeleton } from "./components/DashboardSkeleton";

const DashboardContent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const { data, isLoading } = useQuery<{
    user: User;
    business: Business;
  }>({
    queryKey: ["user_dashboard", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return [];
      const response = await fetch("/api/dashboard", {
        method: "GET",
      });
      return response.json();
    },
    enabled: Boolean(session?.user),
  });

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (isLoading || sessionLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return <div>No data</div>;
  }

  const { business } = data;

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
        <p>{session?.user?.email}</p>
      </div>
      <BusinessDialog
        business={business}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
};

export default DashboardContent;
