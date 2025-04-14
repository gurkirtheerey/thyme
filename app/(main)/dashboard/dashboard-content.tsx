"use client";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { User, Business, Client, user } from "@/db/schema";
import { BusinessDialog } from "./components/BusinessDialog/BusinessDialog";
import { ClientDialog } from "./components/ClientDialog/ClientDialog";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { BusinessCard } from "@/app/components/BusinessCard";

const DashboardContent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const { data, isLoading } = useQuery<{
    user: User;
    business: Business;
    businesses: Business[];
    clients: Client[];
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

  if (isLoading || sessionLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return <div>No data</div>;
  }

  const { business, user, businesses, clients } = data;

  return (
    <>
      {user.role === "provider" && (
        <>
          {business ? (
            <>
              <h1 className="text-2xl font-bold mb-4">
                {business.name}'s Dashboard
              </h1>
              <div className="flex flex-col gap-4 mb-4">
                <h3 className="text-lg font-bold">Business Information</h3>
                <div className="flex justify-between items-start gap-4 shadow-md p-4 rounded-md">
                  <div>
                    <p>{business.address}</p>
                    <p>{business.phone}</p>
                    <p>{business.website}</p>
                  </div>
                  <BusinessDialog
                    business={business}
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4 mb-4 h-screen justify-center items-center">
              <h1 className="text-2xl font-bold mb-4">
                You don't have a business yet.
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                Please create a business to get started.
              </p>
              <BusinessDialog
                business={null}
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
              />
            </div>
          )}
          <div className="flex flex-col gap-4 mb-4">
            <h3 className="text-lg font-bold">Client Summary</h3>
            <div className="flex justify-between items-start gap-4 shadow-md p-4 rounded-md">
              <div className="flex flex-col gap-2">
                <p className="text-md font-bold">
                  Total Clients: {clients.length}
                </p>
                <div className="flex items-center gap-2">
                  {clients.length > 0 && (
                    <>
                      <p className="text-md font-bold">Recently Added:</p>
                      <div className="text-sm text-gray-500 font-bold">
                        {clients
                          .slice(0, 3)
                          .map((client) => client.name)
                          .join(", ")}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <ClientDialog
                dialogOpen={clientDialogOpen}
                setDialogOpen={setClientDialogOpen}
                businessId={business.id}
              />
            </div>
          </div>
        </>
      )}
      {user.role === "client" && (
        <div>
          <h1 className="text-2xl font-bold mb-4">View Businesses</h1>
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
