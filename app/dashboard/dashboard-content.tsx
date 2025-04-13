"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { User, Business } from "@/db/schema";
import { BusinessDialog } from "./components/BusinessDialog/BusinessDialog";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { BusinessCard } from "@/app/components/BusinessCard";

const DashboardContent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const { data, isLoading } = useQuery<{
    user: User;
    business: Business;
    businesses: Business[];
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

  const { business, user, businesses } = data;

  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
        <p>{session?.user?.email}</p>
      </div>
      {user.role === "provider" && (
        <BusinessDialog
          business={business}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      )}
      {user.role === "client" && (
        <div>
          <h1>View Businesses</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 p-4">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardContent;
