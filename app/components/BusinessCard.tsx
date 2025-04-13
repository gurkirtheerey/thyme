import { Business } from "@/db/schema";
import { Building2, MapPin, Phone, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface BusinessCardProps {
  business: Business;
  showViewButton?: boolean;
}

export const BusinessCard = ({
  business,
  showViewButton = true,
}: BusinessCardProps) => {
  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow justify-between">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">{business.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 h-[200px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <p className="text-muted-foreground">{business.description}</p>
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
      {showViewButton && (
        <CardFooter>
          <Link href={`/business/${business.id}`} className="w-full">
            <Button className="w-full">View Business</Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};
