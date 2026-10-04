import { IndustrialSkeleton } from "@/components/ui/industrial-skeleton";

export default function Loading() {
  return (
    <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
      <IndustrialSkeleton />
    </div>
  );
}
