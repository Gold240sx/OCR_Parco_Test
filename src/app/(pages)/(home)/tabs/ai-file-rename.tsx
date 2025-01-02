"use client"
import React, { useState, useRef } from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import FileRenameHeader from "./fileRenameHeader"
import Dropzone from "react-dropzone"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"

const fileSchema = z.object({
	document: z
		.instanceof(File)
		.refine(
			(file) => file.size <= 3 * 1024 * 1024,
			"File size must be less than 3MB"
		)
		.refine(
			(file) => ["image/jpeg", "image/png"].includes(file.type),
			"File must be an image"
		)
		.nullable(),
})

type FormInputs = z.infer<typeof fileSchema>

const AIFileRename = () => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormInputs>({
		resolver: zodResolver(fileSchema),
		defaultValues: {
			document: null,
		},
	})

	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [renamedFile, setRenamedFile] = useState<string | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)

	const handleFileInputClick = () => {
		fileInputRef.current?.click()
	}

	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles && acceptedFiles.length > 0) {
			const file = acceptedFiles[0]
			setUploadedFile(file)
			setImagePreview(URL.createObjectURL(file))
			setValue("document", file)
			toast("File loaded successfully", { icon: "success" })
		}
	}

	const renameFile = async (file: File) => {
		const VALID_API_SECRET = process.env.VALID_API_SECRET
		try {
			const formData = new FormData()
			formData.append("document", file)
			console.log("Sending formData:", formData)
			const { data } = await axios.post("/api/document_title", formData, {
				headers: {
					Authorization: `Bearer ${VALID_API_SECRET}`,
					"Content-Type": "multipart/form-data",
				},
			})

			console.log("Received data:", data)
			const { documentType, AccountType, AgencyType } = data.result

			const newFileName = `${documentType}_${AccountType}_${AgencyType}.${file.name
				.split(".")
				.pop()}`
			setRenamedFile(newFileName)
			toast.success("File renamed successfully!")
		} catch (error) {
			console.error(error)
			toast.error("Failed to rename the file.")
		}
	}

	const handleDownload = () => {
		if (!uploadedFile || !renamedFile) return

		const link = document.createElement("a")
		link.href = imagePreview || ""
		link.download = renamedFile
		link.click()
		toast.success("File downloaded!")
	}

	const onSubmit: SubmitHandler<FormInputs> = async (data) => {
		console.log("Data:", data)
		if (!data.document) console.error("No file uploaded")
		if (data.document) {
			await renameFile(data.document)
			toast("Renaming file", {})
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>A.I. File Rename Example</CardTitle>
				<CardDescription>
					Rename the File Name below and select the Account Statement
					type from the dropdown.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<FileRenameHeader />
				<div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
					<div className="max-w-lg mx-auto space-y-4">
						<form onSubmit={handleSubmit(onSubmit)}>
							<Dropzone
								onDrop={onDrop}
								accept={{ "image/*": [".jpeg", ".png"] }}>
								{({ getRootProps, getInputProps }) => (
									<section className="border-dashed border-2 p-6 rounded-lg cursor-pointer">
										<div {...getRootProps()}>
											<input
												onClick={() => {
													console.log("clicked")
													handleFileInputClick()
												}}
												{...getInputProps()}
												{...register("document")}
											/>
											<p>
												{uploadedFile
													? `${
															uploadedFile.name
													  } - ${(
															uploadedFile.size /
															1024 /
															1024
													  ).toFixed(2)} MB`
													: "Drag 'n' drop a file here, or click to select one"}
											</p>
										</div>
									</section>
								)}
							</Dropzone>
							{errors.document && (
								<p className="text-red-500">
									{errors.document.message}
								</p>
							)}

							{imagePreview && (
								<img
									src={imagePreview}
									alt="Preview"
									className="mt-4 w-full h-auto rounded-md"
								/>
							)}

							<div className="mt-4">
								<Button
									type="submit"
									disabled={!uploadedFile}
									className="disabled:hidden">
									Rename
								</Button>
								<Button
									type="button"
									className="ml-4 disabled:hidden"
									disabled={!renamedFile}
									onClick={handleDownload}>
									Download
								</Button>
							</div>

							{renamedFile && (
								<p className="mt-4 text-green-500">
									Renamed file: {renamedFile}
								</p>
							)}
						</form>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default AIFileRename

/*
const oldFile = () => {
	return (
		<form
			className="flex flex-col gap-2 py-4"
			onSubmit={(e) => {
				e.preventDefault()
				// setFileDownloadReady(true)
			}}>
			<Dropzone
				{...register("document", {
					required: "Document upload is required",
				})}
				onDrop={(acceptedFiles) => {
					if (acceptedFiles && acceptedFiles.length > 0) {
						handleFileUpload(acceptedFiles[0])
						onDrop(acceptedFiles)
					}
				}}>
				{({ getRootProps, getInputProps }) => (
					<section
						className={`min-h-[150px] flex flex-col items-center align-middle justify-center my-8 rounded-lg border-dashed border-zinc-200 hover:border-zinc-400 p-5 border-2 ease-in-out duration-300 transition-all`}>
						{uploadedFile && (
							<div className="flex justify-end w-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									onClick={() => {
										setUploadedFile(null)
										setImagePreviews([])
									}}
									className="h-6 w-6 cursor-pointer hover:text-black"
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
							</div>
						)}
						<div
							{...getRootProps()}
							className="flex flex-col items-center">
							<input {...getInputProps()} />
							<div className="inset-0 h-fit w-fit">
								<p className="cursor-pointer text-center">
									{uploadedFile ? (
										<>
											{uploadedFile.name} -{" "}
											{uploadedFile.size} bytes
										</>
									) : (
										"Drag 'n' drop some files here, or click to select files"
									)}
								</p>
							</div>
						</div>
						{imagePreviews.length > 0 && (
							<div className="flex flex-wrap mt-4">
								{imagePreviews.map((preview, index) => (
									<img
										key={index}
										src={preview}
										alt={`Preview ${index}`}
										className="max-h-[250px] w-auto h-auto object-contain m-2"
										style={{
											maxWidth: "100%",
										}}
									/>
								))}
							</div>
						)}
					</section>
				)}
			</Dropzone>
			{errors.document && (
				<p className="text-red-500 text-sm">
					{errors.document.message}
				</p>
			)}
			<div className="flex flex-col gap-4 my-8">
				{uploadedFile && (
					<p className="px-2 text-sky-700">
						File will be renamed to: "{fileName.documentType}_
						{fileName.accountStatement}.
						{uploadedFile?.name.split(".").pop()}"
					</p>
				)}
				<Button
					type="submit"
					disabled={fileDownloadReady || !uploadedFile}
					className="text-white disabled:opacity-0 font-semibold tracking-wide disabled:hidden bg-black hover:bg-gray-800 rounded-md px-4 w-fit">
					Rename
				</Button>
				<Button
					type="button"
					onClick={() => {
						handleDownload()
					}}
					disabled={!fileDownloadReady}
					className="text-white font-semibold py-4 disabled:opacity-0 disabled:hidden bg-black  hover:bg-gray-800 rounded-md px-4">
					Download renamed file
				</Button>
			</div>
		</form>
	)
}

*/
