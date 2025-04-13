import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Globe } from "lucide-react";

const Loading = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
