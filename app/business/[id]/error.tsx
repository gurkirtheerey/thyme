"use client";
import { Button } from "@/components/ui";
import { Building2 } from "lucide-react";
import Link from "next/link";

const Error = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <Building2 className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Business Not Found</h1>
        <p className="text-muted-foreground">
          The business you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default Error;
