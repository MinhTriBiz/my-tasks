import { FilterType } from "@/types/todo";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterTabsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const FilterTabs = ({ currentFilter, onFilterChange, counts }: FilterTabsProps) => {
  return (
    <Tabs value={currentFilter} onValueChange={(value) => onFilterChange(value as FilterType)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">
          All ({counts.all})
        </TabsTrigger>
        <TabsTrigger value="active">
          Active ({counts.active})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({counts.completed})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
