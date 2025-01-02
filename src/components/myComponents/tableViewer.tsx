"use client"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Copy, Search, X } from "lucide-react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { useState, useEffect } from "react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { exampleQueries } from "@/queries/example"

interface TableViewerProps {
	data?: Record<string, string>
	className?: string
	isLoading?: boolean
	keyColumns?: number[]
	options?: {
		responsive?: {
			transposedRowsOnMobile?: boolean
			stickyRowHeader?: boolean
			stickyColumnHeader?: boolean
			stickyColumnHeaderIndex?: number
		}
		styling?: {
			cellPadding?: string
			cellBorder?: string
			cellBorderRadius?: string
			cellBackgroundColor?: string
			hoverBackgroundColor?: string
			hoverTextColor?: string
			cellGap?: string
			cellGapMobile?: string
			roundedTable?: boolean
			zebraStriping?: boolean
			textPosition?: {
				rowHeaders?: "left" | "center" | "right"
				columnHeaders?: "left" | "center" | "right"
				body?: "left" | "center" | "right"
				footer?: "left" | "center" | "right"
				custom?: {
					rows?: Record<number, "left" | "center" | "right">
					columns?: Record<number, "left" | "center" | "right">
					finalRow?: "left" | "center" | "right"
					finalColumn?: "left" | "center" | "right"
				}
			}
			textClasses?: {
				rowHeaders?: string
				columnHeaders?: string
				body?: string
				footer?: string
			}
		}
		filters?: {
			search?: boolean
			searchPlaceholder?: string
			searchDebounce?: number
		}
		buttons?: {
			copyTable?: boolean
			copyColumn?: boolean
			copyColumnIndex?: number
			exportToExcel?: boolean
		}
		pagination?: {
			enabled?: boolean
			maxRows?: number
			showOnMobile?: boolean
		}
	}
}

interface TableRow {
	container: string
	name: string
	value: string
}

const defaultOptions = {
	className: "my-6 flex flex-col !mb-8",
	responsive: {
		transposedRowsOnMobile: true,
		stickyRowHeader: true,
		stickyColumnHeader: true,
		stickyColumnHeaderIndex: 1,
	},
	styling: {
		roundedTable: true,
		cellPadding: "px-4 py-2",
		cellBackgroundColor: "bg-white dark:bg-zinc-950",
		hoverBackgroundColor: "bg-gray-50 dark:bg-gray-900",
		cellGap: "",
		cellBorderRadius: "",
		cellBorder: "border-b border-r border-gray-200 dark:border-gray-800",
		zebraStriping: true,
		textPosition: {
			rowHeaders: "right",
			columnHeaders: "center",
			body: "center",
			footer: "right",
			custom: {
				rows: {} as Record<number, "left" | "center" | "right">,
				columns: {} as Record<number, "left" | "center" | "right">,
			},
		},
		textClasses: {
			rowHeaders: "font-semibold text-lg text-right",
			columnHeaders: "font-semibold text-lg",
			body: "text-sm",
			footer: "text-sm",
		},
	},
	filters: {
		search: false,
		searchPlaceholder: "Search fields...",
		searchDebounce: 300,
	},
	buttons: {
		copyTable: false,
		copyColumn: false,
		copyColumnIndex: 0,
		exportToExcel: false,
	},
	pagination: {
		enabled: true,
		maxRows: 10,
		showOnMobile: false,
	},
} as const

const generateDemoData = () => {
	const data: Record<string, unknown> = {}
	const categories = ["Income", "Tax", "Deduction", "Benefit", "Leave"]
	const types = ["Regular", "Special", "Annual", "Temporary", "Other"]

	for (let i = 1; i <= 70; i++) {
		const category =
			categories[Math.floor(Math.random() * categories.length)]
		const type = types[Math.floor(Math.random() * types.length)]
		const value = (Math.random() * 10000).toFixed(2)
		data[`${category} ${type} ${i}`] = `$${value}`
	}

	return data
}

const defaultData = generateDemoData()

const recordToArray = (data: Record<string, unknown>) => {
	if (!data || Object.keys(data).length === 0) return []
	return Object.entries(data).map(([key, value]) => ({
		field: key,
		value: value,
	}))
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}

	if (currentPage <= 3) {
		return [1, 2, 3, 4, "...", totalPages - 1, totalPages]
	}

	if (currentPage >= totalPages - 2) {
		return [
			1,
			2,
			"...",
			totalPages - 3,
			totalPages - 2,
			totalPages - 1,
			totalPages,
		]
	}

	return [
		1,
		"...",
		currentPage - 1,
		currentPage,
		currentPage + 1,
		"...",
		totalPages,
	]
}

const TableViewer = ({
	data = {},
	className = "",
	isLoading = false,
	keyColumns = [0, 1],
	options: customOptions = {},
}: TableViewerProps) => {
	const { toast } = useToast()
	const [currentPage, setCurrentPage] = useState(1)
	const [searchTerm, setSearchTerm] = useState("")
	const debouncedSearch = useDebounce(
		searchTerm,
		customOptions.filters?.searchDebounce || 300
	)

	// Convert exampleQueries to our table format
	const allRows = exampleQueries.map((query) => ({
		container: query.Container || "",
		name: query.Name || "",
		value: data[query.Name as string] || "",
	}))

	// Filter rows based on search
	const filteredRows = allRows.filter((row) => {
		if (!debouncedSearch) return true
		const searchLower = debouncedSearch.toLowerCase()
		return (
			String(row.container).toLowerCase().includes(searchLower) ||
			String(row.name).toLowerCase().includes(searchLower) ||
			String(row.value).toLowerCase().includes(searchLower)
		)
	})

	const shouldPaginate =
		customOptions.pagination?.enabled &&
		filteredRows.length > (customOptions.pagination?.maxRows || 10) &&
		(!customOptions.responsive?.transposedRowsOnMobile ||
			window.innerWidth > 768)

	const itemsPerPage = customOptions.pagination?.maxRows || 10
	const totalPages = Math.ceil(filteredRows.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const rows = shouldPaginate
		? filteredRows.slice(startIndex, endIndex)
		: filteredRows

	// Reset to first page when search changes
	useEffect(() => {
		setCurrentPage(1)
	}, [debouncedSearch])

	const options = {
		...defaultOptions,
		...customOptions,
		styling: {
			...defaultOptions.styling,
			...customOptions?.styling,
			textPosition: {
				...defaultOptions.styling.textPosition,
				...customOptions?.styling?.textPosition,
				custom: {
					...defaultOptions.styling.textPosition.custom,
					...customOptions?.styling?.textPosition?.custom,
				},
			},
		},
	}

	// Style objects
	const tableStyles = {
		wrapper: cn(
			"relative w-full overflow-hidden",
			options.styling?.roundedTable ? "rounded-lg border" : "border",
			className
		),
		table: cn(
			"w-full",
			options.styling?.cellGap ? "border-separate" : "border-collapse"
		),
		headerCell: (index: number) =>
			cn(
				options.styling?.cellPadding || "px-4 py-2",
				options.styling?.cellBorder ||
					"border-b border-r border-gray-200 dark:border-gray-800 last:border-r-0",
				"bg-zinc-50 dark:bg-zinc-900",
				"text-gray-900 dark:text-gray-100",
				options.responsive?.stickyColumnHeader && "sticky top-0 z-10",
				options.styling?.textPosition?.columnHeaders &&
					`text-${options.styling.textPosition.columnHeaders}`,
				options.styling?.textClasses?.columnHeaders
			),
		cell: (index: number) =>
			cn(
				options.styling?.cellPadding || "px-4 py-2",
				options.styling?.cellBorder ||
					"border-b border-r border-gray-200 dark:border-gray-800 last:border-r-0",
				options.styling?.zebraStriping
					? "bg-transparent"
					: "bg-white dark:bg-zinc-950",
				"text-gray-900 dark:text-gray-100",
				options.styling?.cellBorderRadius,
				"transition-colors",
				"group-hover:bg-gray-50 dark:group-hover:bg-gray-800",
				options.styling?.textPosition?.body &&
					`text-${options.styling.textPosition.body}`,
				options.styling?.textClasses?.body,
				options.styling?.textPosition?.custom?.columns?.[index],
				options.styling?.textPosition?.custom?.finalColumn &&
					index === 1 &&
					`text-${options.styling.textPosition.custom.finalColumn}`
			),
		row: (index: number, isLastRow: boolean) =>
			cn(
				"group transition-colors",
				isLastRow ? "border-b-0" : "border-b",
				options.styling?.zebraStriping &&
					index % 2 === 1 &&
					"bg-gray-50/50 dark:bg-zinc-900/50",
				"hover:bg-gray-50 dark:hover:bg-gray-800",
				"[&>td]:group-hover:bg-gray-50 dark:[&>td]:group-hover:bg-gray-800",
				options.styling?.textPosition?.custom?.rows?.[index] &&
					`text-${options.styling.textPosition.custom.rows[index]}`,
				isLastRow &&
					options.styling?.textPosition?.custom?.finalRow &&
					`text-${options.styling.textPosition.custom.finalRow}`
			),
	}

	const handleCopyTable = async (entireTable = false) => {
		try {
			const rowsToCopy = entireTable ? allRows : rows
			const text = rowsToCopy
				.map((row) => `${row.container}: ${row.name}: ${row.value}`)
				.join("\n")
			if (rowsToCopy.length === 0) {
				toast({
					title: "No data to copy",
					description: "There is no data to copy",
					variant: "destructive",
				})
				return
			}
			await navigator.clipboard.writeText(text)
			toast({
				title: "Table Copied Successfully",
				description: `${rowsToCopy.length} rows copied to clipboard`,
				variant: "default",
			})
		} catch (err) {
			toast({
				title: "Failed to Copy Table",
				description:
					"Please try again or contact support if the issue persists",
				variant: "destructive",
			})
		}
	}

	const handleCopyColumn = async (entireColumn = false) => {
		try {
			const rowsToCopy = entireColumn ? allRows : rows
			const columnIndex = customOptions?.buttons?.copyColumnIndex || 0
			const text = rowsToCopy
				.map((row) =>
					String(columnIndex === 0 ? row.container : row.value)
				)
				.join("\n")
			if (rowsToCopy.length === 0) {
				toast({
					title: "No data to copy",
					description: "There is no data to copy",
					variant: "destructive",
				})
				return
			}
			await navigator.clipboard.writeText(text)
			toast({
				title: "Column Copied Successfully",
				description: `Column ${columnIndex + 1} (${
					rowsToCopy.length
				} values) copied to clipboard`,
			})
		} catch (err) {
			toast({
				title: "Failed to Copy Column",
				description:
					"Please try again or contact support if the issue persists",
				variant: "destructive",
			})
		}
	}

	const getRowKey = (row: TableRow) => {
		const values = keyColumns.map((index) => {
			switch (index) {
				case 0:
					return row.container
				case 1:
					return row.name
				case 2:
					return row.value
				default:
					return ""
			}
		})
		return values.join(".")
	}

	return (
		<div className={cn("space-y-4 max-w-screen-md mx-auto", className)}>
			<div className="flex justify-between align-middle items-center gap-4">
				{customOptions.filters?.search && (
					<div className="relative flex-1">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={
								customOptions.filters.searchPlaceholder ||
								"Search fields..."
							}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={cn(
								"pl-8",
								searchTerm.length > 0 && "pr-8"
							)}
							disabled={isLoading}
						/>
						{searchTerm.length > 0 && (
							<button
								onClick={() => setSearchTerm("")}
								className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
								aria-label="Clear search">
								<X className="h-4 w-4" />
							</button>
						)}
					</div>
				)}
				{(customOptions.buttons?.copyTable ||
					customOptions.buttons?.copyColumn) && (
					<div className="flex gap-2">
						{customOptions.buttons?.copyTable && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-2">
										<Copy className="h-4 w-4" />
										Copy Table
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem
										onClick={() => handleCopyTable(false)}>
										Copy Current Page
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleCopyTable(true)}>
										Copy Entire Table
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
						{customOptions.buttons?.copyColumn && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-2">
										<Copy className="h-4 w-4" />
										Copy Column{" "}
										{(customOptions.buttons
											?.copyColumnIndex ?? 0) + 1}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem
										onClick={() => handleCopyColumn(false)}>
										Copy Visible Column{" "}
										{(customOptions?.buttons
											?.copyColumnIndex ?? 0) + 1}{" "}
										({rows.length} values)
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleCopyColumn(true)}>
										Copy Entire Column{" "}
										{(customOptions?.buttons
											?.copyColumnIndex ?? 0) + 1}{" "}
										({allRows.length} values)
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				)}
			</div>
			<div className={tableStyles.wrapper}>
				<Table className={tableStyles.table}>
					<TableHeader>
						<TableRow>
							<TableHead className={tableStyles.headerCell(0)}>
								Container
							</TableHead>
							<TableHead className={tableStyles.headerCell(1)}>
								Name
							</TableHead>
							<TableHead className={tableStyles.headerCell(2)}>
								Value
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={3} className="h-24">
									<div className="flex items-center justify-center">
										<div className="animate-pulse flex space-x-4 items-center text-muted-foreground">
											<div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
											<div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
											<div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
											<span className="ml-2">
												Loading data...
											</span>
										</div>
									</div>
								</TableCell>
							</TableRow>
						) : rows.length > 0 ? (
							rows.map((row, index) => (
								<TableRow
									key={getRowKey(row)}
									className={tableStyles.row(
										index,
										index === rows.length - 1
									)}>
									<TableCell className={tableStyles.cell(0)}>
										{row.container}
									</TableCell>
									<TableCell className={tableStyles.cell(1)}>
										{row.name}
									</TableCell>
									<TableCell className={tableStyles.cell(2)}>
										{row.value}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={3}
									className="h-24 text-center">
									No data
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{shouldPaginate && totalPages > 1 && (
				<Pagination>
					<PaginationContent
						className={
							isLoading ? "pointer-events-none opacity-50" : ""
						}>
						<PaginationItem>
							<PaginationPrevious
								onClick={() =>
									setCurrentPage((p) => Math.max(1, p - 1))
								}
								className={cn(
									"cursor-pointer",
									currentPage === 1 &&
										"pointer-events-none opacity-50"
								)}
							/>
						</PaginationItem>

						{getPageNumbers(currentPage, totalPages).map(
							(pageNum, i) => (
								<PaginationItem key={i}>
									{pageNum === "..." ? (
										<PaginationEllipsis />
									) : (
										<PaginationLink
											onClick={() =>
												setCurrentPage(
													pageNum as number
												)
											}
											isActive={currentPage === pageNum}
											className="cursor-pointer">
											{pageNum}
										</PaginationLink>
									)}
								</PaginationItem>
							)
						)}

						<PaginationItem>
							<PaginationNext
								onClick={() =>
									setCurrentPage((p) =>
										Math.min(totalPages, p + 1)
									)
								}
								className={cn(
									"cursor-pointer",
									currentPage === totalPages &&
										"pointer-events-none opacity-50"
								)}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}

export default TableViewer
