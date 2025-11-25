"use client";

import { useState, useEffect } from "react";
import { Filter, X, Save, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export interface TicketFilters {
  assignee?: string;
  status?: string;
  wlMainTicketType?: string;
  wlSubTicketType?: string;
  customerLevel?: string;
  dateFrom?: string;
  dateTo?: string;
  jqlQuery?: string;
}

interface SavedFilter {
  id: string;
  name: string;
  filters: TicketFilters;
}

interface TicketFiltersProps {
  availableAssignees: string[];
  availableStatuses: string[];
  availableMainTypes: string[];
  availableSubTypes: string[];
  availableCustomerLevels: string[];
  onFiltersChange: (filters: TicketFilters) => void;
}

export function TicketFiltersComponent({
  availableAssignees,
  availableStatuses,
  availableMainTypes,
  availableSubTypes,
  availableCustomerLevels,
  onFiltersChange,
}: TicketFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<TicketFilters>({});
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [filterName, setFilterName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedFilters");
      if (saved) {
        setSavedFilters(JSON.parse(saved));
      }
    }
  }, []);

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== "").length;

  const handleFilterChange = (key: keyof TicketFilters, value: string) => {
    const newFilters = { ...filters };
    if (value === "" || value === "all") {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    setFilters({});
    onFiltersChange({});
    toast.success("All filters cleared");
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast.error("Please enter a filter name");
      return;
    }

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: { ...filters },
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));

    setFilterName("");
    setShowSaveInput(false);
    toast.success(`Filter "${filterName}" saved`);
  };

  const handleLoadFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters);
    onFiltersChange(savedFilter.filters);
    toast.success(`Filter "${savedFilter.name}" applied`);
  };

  const handleDeleteFilter = (id: string) => {
    const updated = savedFilters.filter((f) => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem("savedFilters", JSON.stringify(updated));
    toast.success("Filter deleted");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 relative"
        >
          <Filter className="w-3.5 h-3.5 mr-1.5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <Badge
              variant="default"
              className="ml-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h4 className="font-semibold text-sm">Filters</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Filter tickets by various criteria
            </p>
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-7 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Assignee
            </label>
            <Select
              value={filters.assignee || "all"}
              onValueChange={(value) => handleFilterChange("assignee", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assignees</SelectItem>
                {availableAssignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status
            </label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              WL Main Type
            </label>
            <Select
              value={filters.wlMainTicketType || "all"}
              onValueChange={(value) => handleFilterChange("wlMainTicketType", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {availableMainTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              WL Sub Type
            </label>
            <Select
              value={filters.wlSubTicketType || "all"}
              onValueChange={(value) => handleFilterChange("wlSubTicketType", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All sub types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sub types</SelectItem>
                {availableSubTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Customer Level
            </label>
            <Select
              value={filters.customerLevel || "all"}
              onValueChange={(value) => handleFilterChange("customerLevel", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                {availableCustomerLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Created Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="h-8 text-xs"
                placeholder="From"
              />
              <Input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="h-8 text-xs"
                placeholder="To"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              JQL Query (Advanced)
            </label>
            <Input
              value={filters.jqlQuery || ""}
              onChange={(e) => handleFilterChange("jqlQuery", e.target.value)}
              placeholder='e.g., status = "In Progress" AND assignee = currentUser()'
              className="h-8 text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Use Jira Query Language for advanced filtering
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Saved Filters
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSaveInput(!showSaveInput)}
                className="h-6 text-xs"
                disabled={activeFilterCount === 0}
              >
                <Save className="w-3 h-3 mr-1" />
                Save current
              </Button>
            </div>

            {showSaveInput && (
              <div className="flex gap-2">
                <Input
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Filter name..."
                  className="h-7 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveFilter();
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleSaveFilter}
                  className="h-7 text-xs"
                >
                  Save
                </Button>
              </div>
            )}

            {savedFilters.length > 0 ? (
              <div className="space-y-1">
                {savedFilters.map((savedFilter) => (
                  <div
                    key={savedFilter.id}
                    className="flex items-center justify-between p-2 rounded-md border border-border hover:bg-muted/50 transition-colors"
                  >
                    <button
                      onClick={() => handleLoadFilter(savedFilter)}
                      className="flex-1 text-left text-xs font-medium"
                    >
                      {savedFilter.name}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFilter(savedFilter.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                No saved filters yet
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
