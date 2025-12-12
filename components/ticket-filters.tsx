"use client"

import { useState, useEffect } from "react"
import { Filter, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
	FilterSelect,
	SavedFilters,
	type TicketFilters,
	type SavedFilter,
} from "./filters"

export type { TicketFilters }

interface TicketFiltersProps {
	availableAssignees: string[]
	availableStatuses: string[]
	availableMainTypes: string[]
	availableSubTypes: string[]
	availableCustomerLevels: string[]
	onFiltersChange: (filters: TicketFilters) => void
}

export function TicketFiltersComponent({
	availableAssignees,
	availableStatuses,
	availableMainTypes,
	availableSubTypes,
	availableCustomerLevels,
	onFiltersChange,
}: TicketFiltersProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [filters, setFilters] = useState<TicketFilters>({})
	const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])

	useEffect(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("savedFilters")
			if (saved) {
				setSavedFilters(JSON.parse(saved))
			}
		}
	}, [])

	const activeFilterCount = Object.values(filters).filter(
		(v) => v && v !== ""
	).length

	const handleFilterChange = (key: keyof TicketFilters, value: string) => {
		const newFilters = { ...filters }
		if (value === "" || value === "all") {
			delete newFilters[key]
		} else {
			newFilters[key] = value
		}
		setFilters(newFilters)
		onFiltersChange(newFilters)
	}

	const handleClearAll = () => {
		setFilters({})
		onFiltersChange({})
		toast.success("All filters cleared")
	}

	const handleSaveFilter = (filter: SavedFilter) => {
		const updated = [...savedFilters, filter]
		setSavedFilters(updated)
		localStorage.setItem("savedFilters", JSON.stringify(updated))
	}

	const handleLoadFilter = (savedFilter: SavedFilter) => {
		setFilters(savedFilter.filters)
		onFiltersChange(savedFilter.filters)
	}

	const handleDeleteFilter = (id: string) => {
		const updated = savedFilters.filter((f) => f.id !== id)
		setSavedFilters(updated)
		localStorage.setItem("savedFilters", JSON.stringify(updated))
	}

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="sm" className="h-8 relative">
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
					<FilterSelect
						label="Assignee"
						value={filters.assignee || ""}
						options={availableAssignees}
						placeholder="All assignees"
						onChange={(value) => handleFilterChange("assignee", value)}
					/>

					<FilterSelect
						label="Status"
						value={filters.status || ""}
						options={availableStatuses}
						placeholder="All statuses"
						onChange={(value) => handleFilterChange("status", value)}
					/>

					<FilterSelect
						label="WL Main Type"
						value={filters.wlMainTicketType || ""}
						options={availableMainTypes}
						placeholder="All types"
						onChange={(value) => handleFilterChange("wlMainTicketType", value)}
					/>

					<FilterSelect
						label="WL Sub Type"
						value={filters.wlSubTicketType || ""}
						options={availableSubTypes}
						placeholder="All sub types"
						onChange={(value) => handleFilterChange("wlSubTicketType", value)}
					/>

					<FilterSelect
						label="Customer Level"
						value={filters.customerLevel || ""}
						options={availableCustomerLevels}
						placeholder="All levels"
						onChange={(value) => handleFilterChange("customerLevel", value)}
					/>

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

					<SavedFilters
						savedFilters={savedFilters}
						currentFilters={filters}
						activeFilterCount={activeFilterCount}
						onSave={handleSaveFilter}
						onLoad={handleLoadFilter}
						onDelete={handleDeleteFilter}
					/>
				</div>
			</PopoverContent>
		</Popover>
	)
}
