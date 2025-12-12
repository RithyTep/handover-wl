"use client"

import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import type { Theme } from "@/enums"
import { getTableThemeStyles } from "./theme-styles"

interface DesktopTableProps<TData, TValue> {
	table: TanstackTable<TData>
	columns: ColumnDef<TData, TValue>[]
	theme: Theme
}

export function DesktopTable<TData, TValue>({
	table,
	columns,
	theme,
}: DesktopTableProps<TData, TValue>) {
	const styles = getTableThemeStyles(theme)

	return (
		<div
			className={`overflow-hidden hidden sm:flex sm:flex-col ${styles.container}`}
		>
			<div className="overflow-auto">
				<Table className="min-w-full md:min-w-[1400px]">
					<TableHeader className={`sticky top-0 z-10 ${styles.header}`}>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className={`hover:bg-transparent ${styles.headerRow}`}
							>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className={`h-10 px-3 text-xs font-bold uppercase tracking-wide ${styles.headerCell}`}
										style={{
											width: header.getSize() !== 150 ? header.getSize() : undefined,
										}}
									>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody className={styles.body}>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, index) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className={`transition-colors duration-150 ${styles.row(index)}`}
								>
									{row.getVisibleCells().map((cell, cellIndex) => (
										<TableCell
											key={cell.id}
											className={`px-3 py-2 ${styles.cell(cellIndex)}`}
											style={{
												width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined,
											}}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className={styles.emptyCell}>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
