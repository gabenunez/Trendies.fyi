"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LuMerge, LuSplit } from "react-icons/lu";
import { IconType } from "react-icons";
import { useSearchParams, useRouter } from "next/navigation";
import {
  createUrl,
  addItemToQueryParm,
  removeItemFromQueryParm,
} from "@/lib/utils";

type Views = "combined" | "split";

type ViewOptions = {
  [K in Views]: {
    icon: IconType;
    name: string;
  };
};

const options: ViewOptions = {
  combined: {
    icon: LuMerge,
    name: "Combined",
  },
  split: {
    icon: LuSplit,
    name: "Split",
  },
};

export default function ViewButton({
  currentView = "combined",
}: {
  currentView: Views;
}) {
  const filteredViews = Object.keys(options).filter(
    (key) => key !== currentView
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());

  const DropdownButton = ({
    view,
    isPrimaryDropdownButton,
  }: {
    view: Views;
    isPrimaryDropdownButton?: boolean;
  }) => {
    const Icon = options[view].icon;
    const title = options[view].name;

    const handleOnClick = () => {
      if (isPrimaryDropdownButton) return;

      let updatedQueryParams;

      updatedQueryParams = removeItemFromQueryParm({
        params: newParams,
        paramKey: "mode",
        itemToDelete: currentView,
      });

      if (view !== "combined") {
        updatedQueryParams = addItemToQueryParm({
          params: updatedQueryParams,
          paramKey: "mode",
          newItem: view,
        });
      }
      return router.replace(createUrl("/", updatedQueryParams));
    };

    return (
      <Button onClick={handleOnClick}>
        <Icon size={"1.4em"} className="mr-1" /> {title}
      </Button>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="absolute z-10 opacity-60 hover:opacity-100 top-0 right-0 p-2">
          <DropdownButton view={currentView} isPrimaryDropdownButton />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full bg-transparent hover:bg-transparent border-none shadow-none text-center opacity-100 ">
        {filteredViews.map((view) => {
          return <DropdownButton key={view} view={view} />;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
