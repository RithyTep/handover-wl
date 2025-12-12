"use client"

import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FilterSelect } from "./filter-select"
import type { TicketFilters } from "./filter-types"

interface FilterFormProps {
	filters: TicketFilters
	availableAssignees: string[]
	availableStatuses: string[]
	availableMainTypes: string[]
	availableSubTypes: string[]
	availableCustomerLevels: string[]
	onFilterChange: (key: keyof TicketFilters, value: string) => void
}

export function FilterForm({
	filters,
	availableAssignees,
	availableStatuses,
	availableMainTypes,
	availableSubTypes,
	availableCustomerLevels,
	onFilterChange,
}: FilterFormProps) {
	return (
		<div className="space-y-4">
			<FilterSelect
				label="Assignee"
				value={filters.assignee || ""}
				options={availableAssignees}
				placeholder="All assignees"
				onChange={(value) => onFilterChange("assignee", value)}
			/>

			<FilterSelect
				label="Status"
				value={filters.status || ""}
				options={availableStatuses}
				placeholder="All statuses"
				onChange={(value) => onFilterChange("status", value)}
			/>

			<FilterSelect
				label="WL Main Type"
				value={filters.wlMainTicketType || ""}
				options={availableMainTypes}
				placeholder="All types"
				onChange={(value) => onFilterChange("wlMainTicketType", value)}
			/>

			<FilterSelect
				label="WL Sub Type"
				value={filters.wlSubTicketType || ""}
				options={availableSubTypes}
				placeholder="All sub types"
				onChange={(value) => onFilterChange("wlSubTicketType", value)}
			/>

			<FilterSelect
				label="Customer Level"
				value={filters.customerLevel || ""}
				options={availableCustomerLevels}
				placeholder="All levels"
				onChange={(value) => onFilterChange("customerLevel", value)}
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
						onChange={(e) => onFilterChange("dateFrom", e.target.value)}
						className="h-8 text-xs"
						placeholder="From"
						aria-label="Filter from date"
					/>
					<Input
						type="date"
						value={filters.dateTo || ""}
						onChange={(e) => onFilterChange("dateTo", e.target.value)}
						className="h-8 text-xs"
						placeholder="To"
						aria-label="Filter to date"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
					JQL Query (Advanced)
				</label>
				<Input
					value={filters.jqlQuery || ""}
					onChange={(e) => onFilterChange("jqlQuery", e.target.value)}
					placeholder='e.g., status = "In Progress" AND assignee = currentUser()'
					className="h-8 text-xs font-mono"
					aria-label="JQL query filter"
				/>
				<p className="text-[10px] text-muted-foreground">
					Use Jira Query Language for advanced filtering
				</p>
			</div>
		</div>
	)
}
