"use client"
import React, { useState } from "react"
import Image from "next/image"
import { QueryConverter } from "../../functions/queryConverter"
import Dropzone from "react-dropzone"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { FileDocRenameType, AccountType } from "@/types/FileTypes"
import AIFileRename from "./tabs/ai-file-rename"
import FileRenameHeader from "./tabs/fileRenameHeader"
import ManualRenameSection from "./tabs/manualRenameSection"
import Link from "next/link"

const queries = [
	{
		marker: "DEDUCTIONS > TSP SAVINGS x CURRENT",
		verified: true,
	},
	{
		marker: "DEDUCTIONS > ITEM > TSP SAVINGS",
		verified: true,
	},
	{
		marker: "DEDUCTIONS > ITEM > TSP SAVINGS x CURRENT",
		verified: true,
	},
	{
		marker: "TSP SAVINGS x CURRENT",
		verified: true,
	},
	{
		marker: "DEDUCTIONS > TSP SAVINGS",
		verified: true,
	},
	{
		marker: "PAY PERIOD",
		verified: true,
	},
]

export default function Home() {
	return (
		<div className="grid justify-items-center min-h-screen h-fit overflow-scroll p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
			<Image
				className=""
				src="/next.svg"
				alt="Next.js logo"
				width={180}
				height={38}
				priority
			/>
			<div className="text-center flex h-16 gap-5 align-middle mb-8">
				<h1 className="text-3xl font-bold text-black">
					Welcome to Parco
				</h1>
				<Link href="/apiTester">
					<Button className="text-lg">Go to API Tester</Button>
				</Link>
			</div>
			<Tabs defaultValue="file-rename" className="w-full h-fit">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="query-convert">
						Query Conversion
					</TabsTrigger>
					<TabsTrigger value="file-rename">File Rename</TabsTrigger>
					<TabsTrigger value="ai-file-rename">
						AI FIle Rename
					</TabsTrigger>
				</TabsList>
				<TabsContent value="file-rename">
					<Card>
						<CardHeader>
							<CardTitle>Manual File Rename Example</CardTitle>
							<CardDescription>
								Rename the File Name below and select the
								Account Statement type from the dropdown.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<FileRenameHeader />
							<ManualRenameSection />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="query-convert">
					<Card>
						<CardHeader>
							<CardTitle>Query Conversion</CardTitle>
							<CardDescription>
								Shows the query Conversion to work amoungst
								multiple different Marker queries. (also used
								for testing)
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<QueryConverterSection />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="ai-file-rename">
					<AIFileRename />
				</TabsContent>
			</Tabs>
		</div>
	)
}

const QueryConverterSection = () => {
	return (
		<main className="flex flex-col gap-8 mb-24 row-start-2 items-center sm:items-start">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="">Marker</TableHead>
						<TableHead>Converted Text</TableHead>
						<TableHead className="text-right">Valid</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{queries.map((query) => (
						<TableRow key={query.marker}>
							<TableCell className="font-medium">
								{query.marker}
							</TableCell>
							<TableCell>
								{QueryConverter(query.marker)}
							</TableCell>
							<TableCell className="text-right">
								{query.verified ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-green-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-red-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	)
}
