import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="space-y-4">
      {/* Header with title and button */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      {/* Calendar toolbar */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-24" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Calendar grid */}
      <div className="border rounded-md">
        {/* Calendar header - days of week */}
        <div className="grid grid-cols-7 border-b">
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`day-${i}`} className="h-10 m-1 rounded-md" />
            ))}
        </div>

        {/* Calendar body - 5 weeks */}
        {Array(5)
          .fill(0)
          .map((_, weekIndex) => (
            <div key={`week-${weekIndex}`} className="grid grid-cols-7">
              {Array(7)
                .fill(0)
                .map((_, dayIndex) => (
                  <div
                    key={`cell-${weekIndex}-${dayIndex}`}
                    className="min-h-[100px] border-r border-b p-1"
                  >
                    <Skeleton className="h-6 w-6 mb-2 rounded-md" />

                    {/* Deterministic events based on day position */}
                    {Array(((weekIndex + dayIndex) % 3) + 1)
                      .fill(0)
                      .map((_, eventIndex) => (
                        <Skeleton
                          key={`event-${weekIndex}-${dayIndex}-${eventIndex}`}
                          className="h-6 w-full mb-1 rounded-sm"
                        />
                      ))}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Loading;
