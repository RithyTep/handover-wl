"use client"

import { useState } from "react"
import { Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import type { SavedFilter, TicketFilters } from "./filter-types"

interface SavedFiltersProps {
	savedFilters: SavedFilter[]
	currentFilters: TicketFilters
	activeFilterCount: number
	onSave: (filter: SavedFilter) => void
	onLoad: (filter: SavedFilter) => void
	onDelete: (id: string) => void
}

export function SavedFilters({
	savedFilters,
	currentFilters,
	activeFilterCount,
	onSave,
	onLoad,
	onDelete,
}: SavedFiltersProps) {
	const [showSaveInput, setShowSaveInput] = useState(false)
	const [filterName, setFilterName] = useState("")

	const handleSaveFilter = () => {
		if (!filterName.trim()) {
			toast.error("Please enter a filter name")
			return
		}

		const newFilter: SavedFilter = {
			id: Date.now().toString(),
			name: filterName,
			filters: { ...currentFilters },
		}

		onSave(newFilter)
		setFilterName("")
		setShowSaveInput(false)
		toast.success(`Filter "${filterName}" saved`)
	}

	const handleLoadFilter = (savedFilter: SavedFilter) => {
		onLoad(savedFilter)
		toast.success(`Filter "${savedFilter.name}" applied`)
	}

	const handleDeleteFilter = (id: string) => {
		onDelete(id)
		toast.success("Filter deleted")
	}

	return (
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
							if (e.key === "Enter") handleSaveFilter()
						}}
					/>
					<Button size="sm" onClick={handleSaveFilter} className="h-7 text-xs">
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
	)
}
