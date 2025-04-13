"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { User, Business } from "@/db/schema";
import { BusinessDialog } from "./components/BusinessDialog/BusinessDialog";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui";
import { MapPin, Phone, Globe, Building2 } from "lucide-react";
import Link from "next/link";
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {businesses.map((business) => (
              <Card
                key={business.id}
                className="w-full max-w-md hover:shadow-lg transition-shadow justify-between"
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">{business.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 h-[200px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <p className="text-muted-foreground">
                    {business.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{business.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{business.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {business.website && (
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {business.website}
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/business/${business.id}`}
                    className="w-full"
                    target="_blank"
                  >
                    <Button className="w-full">View Business</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardContent;
