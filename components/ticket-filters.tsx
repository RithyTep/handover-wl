"use client"

import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
	FilterForm,
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

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
	const [storedValue, setStoredValue] = useState<T>(initialValue)

	useEffect(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem(key)
			if (saved) {
				setStoredValue(JSON.parse(saved))
			}
		}
	}, [key])

	const setValue = (value: T) => {
		setStoredValue(value)
		localStorage.setItem(key, JSON.stringify(value))
	}

	return [storedValue, setValue]
}

function countActiveFilters(filters: TicketFilters): number {
	return Object.values(filters).filter((v) => v && v !== "").length
}

function handleFilterUpdate(
	filters: TicketFilters,
	key: keyof TicketFilters,
	value: string
): TicketFilters {
	const newFilters = { ...filters }
	if (value === "" || value === "all") {
		delete newFilters[key]
	} else {
		newFilters[key] = value
	}
	return newFilters
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
	const [savedFilters, setSavedFilters] = useLocalStorage<SavedFilter[]>("savedFilters", [])

	const activeFilterCount = countActiveFilters(filters)

	const handleFilterChange = (key: keyof TicketFilters, value: string) => {
		const newFilters = handleFilterUpdate(filters, key, value)
		setFilters(newFilters)
		onFiltersChange(newFilters)
	}

	const handleClearAll = () => {
		setFilters({})
		onFiltersChange({})
		toast.success("All filters cleared")
	}

	const handleSaveFilter = (filter: SavedFilter) => {
		setSavedFilters([...savedFilters, filter])
	}

	const handleLoadFilter = (savedFilter: SavedFilter) => {
		setFilters(savedFilter.filters)
		onFiltersChange(savedFilter.filters)
	}

	const handleDeleteFilter = (id: string) => {
		setSavedFilters(savedFilters.filter((f) => f.id !== id))
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
					<FilterForm
						filters={filters}
						availableAssignees={availableAssignees}
						availableStatuses={availableStatuses}
						availableMainTypes={availableMainTypes}
						availableSubTypes={availableSubTypes}
						availableCustomerLevels={availableCustomerLevels}
						onFilterChange={handleFilterChange}
					/>

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
