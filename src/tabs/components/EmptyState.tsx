import { Bookmark } from "iconoir-react";
import CardSpotlight from "./CardSpotlight";

const EmptyState = () => {
  return (
    <CardSpotlight className="w-full h-96">
      <div className="flex flex-col items-center justify-center h-full gap-1">
        <Bookmark
          width="56px"
          height="56px"
          strokeWidth={0.75}
        />
        <p className="mt-4 font-medium">No saved bookmarks</p>
        <p className="text-sm text-zinc-500">
          Add your first bookmark and it will appear here.
        </p>
      </div>
    </CardSpotlight>
  );
};

export default EmptyState;
