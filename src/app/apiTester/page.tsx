"use client"
import React, { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import MockAPI from "./tabs/mock_api"
import TextractUploader from "./tabs/textract_api_uploader"
import textractLogo from "@/assets/icons/textract.png"
import { X } from "lucide-react"
import parcoLogo from "@/assets/branding/parco_large.png"

export default function APITesterPage() {
	return (
		<div className="grid justify-items-center min-h-screen h-fit overflow-scroll p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
			<div className="flex gap-8 justify-center items-center">
				<Image
					className=""
					src={parcoLogo}
					alt="Parco Logo"
					width={180}
					height={38}
					priority
				/>
				<X className="w-8 h-auto my-auto text-zinc-400" />
				<Image
					className="mt-2"
					src="/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>
			</div>
			<div className="text-center flex h-16 gap-5 align-middle mb-8">
				<h1 className="text-3xl font-bold text-black">API Tester</h1>
				<Link href="/">
					<Button className="text-lg">Back to Home</Button>
				</Link>
			</div>
			<Tabs defaultValue="mock-api" className="w-fit h-fit">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="mock-api">Mock Api Limit</TabsTrigger>
					<TabsTrigger value="real-api">
						Textract Api Call
					</TabsTrigger>
				</TabsList>
				<TabsContent value="mock-api">
					<Card>
						<CardHeader>
							<CardTitle className="text-3xl">
								Mock OCR API Call
							</CardTitle>
							<CardDescription className="w-4/5 text-center justify-middle flex mx-auto">
								This section tests multiple API calls to await
								the response each time, to promise.all the
								responses and to populate a unified response as
								if the API was called once.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<MockAPI />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="real-api">
					<Card>
						<CardHeader>
							<CardTitle className="text-3xl flex gap-4">
								<Image
									className="rounded-xl shadow-sm aspect-square object-cover"
									src={textractLogo}
									alt="Textract Logo"
									width={32}
									height={32}
								/>
								Textract API Uploader Auto-Fill Form
							</CardTitle>
							<CardDescription className="w-4/5 text-center justify-middle flex mx-auto">
								Upload a document to have it processed through
								textract and see the results populated below.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<TextractUploader />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="ai-file-rename">
					// Card Content
				</TabsContent>
			</Tabs>
		</div>
	)
}
