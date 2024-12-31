import { AnimatePresence, motion } from "framer-motion"
import { Dispatch, SetStateAction } from "react"
import { FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi"

type Variant = "success" | "error" | "info"

interface SpringModalProps {
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
	variant?: Variant
	title: string
	message: string
	primaryButtonText?: string
	secondaryButtonText?: string
	onPrimaryClick?: () => void
	onSecondaryClick?: () => void
}

const variantStyles = {
	success: {
		gradient: "from-emerald-500 to-green-500",
		icon: FiCheckCircle,
		iconBg: "text-green-600",
		buttonText: "text-green-600",
	},
	error: {
		gradient: "from-red-500 to-rose-500",
		icon: FiXCircle,
		iconBg: "text-rose-600",
		buttonText: "text-rose-600",
	},
	info: {
		gradient: "from-violet-600 to-indigo-600",
		icon: FiAlertCircle,
		iconBg: "text-indigo-600",
		buttonText: "text-indigo-600",
	},
}

export const SpringModal = ({
	isOpen,
	setIsOpen,
	variant = "info",
	title,
	message,
	primaryButtonText = "Great!",
	secondaryButtonText,
	onPrimaryClick,
	onSecondaryClick,
}: SpringModalProps) => {
	const { gradient, icon: Icon, iconBg, buttonText } = variantStyles[variant]

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={() => setIsOpen(false)}
					className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer">
					<motion.div
						initial={{ scale: 0, rotate: "12.5deg" }}
						animate={{ scale: 1, rotate: "0deg" }}
						exit={{ scale: 0, rotate: "0deg" }}
						onClick={(e) => e.stopPropagation()}
						className={`bg-gradient-to-br ${gradient} text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden`}>
						<Icon className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
						<div className="relative z-10">
							<div
								className={`bg-white w-16 h-16 mb-2 rounded-full text-3xl ${iconBg} grid place-items-center mx-auto`}>
								<Icon />
							</div>
							<h3 className="text-3xl font-bold text-center mb-2">
								{title}
							</h3>
							<p className="text-center mb-6">{message}</p>
							<div className="flex gap-2">
								{secondaryButtonText && (
									<button
										onClick={() => {
											onSecondaryClick?.()
											setIsOpen(false)
										}}
										className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded">
										{secondaryButtonText}
									</button>
								)}
								<button
									onClick={() => {
										onPrimaryClick?.()
										setIsOpen(false)
									}}
									className={`bg-white hover:opacity-90 transition-opacity ${buttonText} font-semibold w-full py-2 rounded`}>
									{primaryButtonText}
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
