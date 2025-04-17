
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FaqSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const FaqSearchBar = ({
  searchQuery,
  onSearchChange
}: FaqSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜索FAQ..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FaqSearchBar;
