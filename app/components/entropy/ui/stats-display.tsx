import { memo } from "react";

interface StatsDisplayProps {
  bodyCount: number;
  totalLost: number;
}

export const StatsDisplay = memo(function StatsDisplay({
  bodyCount,
  totalLost,
}: StatsDisplayProps) {
  return (
    <>
      {totalLost > 0 && (
        <div className="text-muted absolute right-8 bottom-8 font-mono text-xs">
          <span className="block text-right">{totalLost} letters</span>
          <span className="block text-right">lost to entropy</span>
        </div>
      )}
      <div className="text-muted absolute bottom-8 left-8 font-mono text-xs">
        <span className="block">{bodyCount} fragments</span>
        <span className="block">still falling</span>
      </div>
    </>
  );
});
