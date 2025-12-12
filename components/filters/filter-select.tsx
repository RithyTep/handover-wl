"use client"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import type { FilterSelectProps } from "./filter-types"

export function FilterSelect({
	label,
	value,
	options,
	placeholder,
	onChange,
}: FilterSelectProps) {
	return (
		<div className="space-y-2">
			<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
				{label}
			</label>
			<Select value={value || "all"} onValueChange={onChange}>
				<SelectTrigger className="h-8 text-xs">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">{placeholder}</SelectItem>
					{options.map((option) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
