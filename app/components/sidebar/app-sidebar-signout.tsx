"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
const AppSidebarSignout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSignOut = async () => {
    setIsLoading(true);
    await authClient.signOut();
    router.push("/login");
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <DropdownMenuItem>
        <Skeleton className="h-4 w-full" />
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <LogOut className="w-4 h-4" />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
};

export default AppSidebarSignout;
