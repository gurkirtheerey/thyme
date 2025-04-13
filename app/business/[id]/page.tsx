import { db } from "@/db";
import { eq } from "drizzle-orm";
import { businesses, services } from "@/db/schema";
import { MapPin, Phone, Globe, Clock, ArrowLeft } from "lucide-react";
import Error from "./error";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const business = await db.query.businesses.findFirst({
    where: eq(businesses.id, id),
  });

  if (!business) {
    return <Error />;
  }

  const service = await db.query.services.findFirst({
    where: eq(services.businessId, id),
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">
                {business.name.charAt(0)}
              </span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{business.name}</h1>
              <p className="text-muted-foreground">Business Profile</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="text-muted-foreground">
              {business.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="space-y-4">
            {business.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm">{business.address}</p>
              </div>
            )}
            {business.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm">{business.phone}</p>
              </div>
            )}
            {business.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {business.website}
                </a>
              </div>
            )}
            {service && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-primary">
                    ${service.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/ hour</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
