import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	LayoutDashboard,
	Workflow,
	BarChart3,
	Settings,
	Menu,
	X,
	Sparkles,
	Bell,
	Search as SearchIcon,
	Database,
	Code,
} from "lucide-react";

type LayoutProps = {
	children?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const navigationItems = [
		{
			to: "/",
			icon: <LayoutDashboard className="w-5 h-5" />,
			label: "Dashboard",
			description: "Overview & metrics",
		},
		{
			to: "/workflow",
			icon: <Workflow className="w-5 h-5" />,
			label: "Workflow",
			description: "Content pipeline",
		},
		{
			to: "/research",
			icon: <Database className="w-5 h-5" />,
			label: "Research",
			description: "Data & insights",
		},
		{
			to: "/code",
			icon: <Code className="w-5 h-5" />,
			label: "Code Generator",
			description: "AI-powered coding",
		},
		{
			to: "/analytics",
			icon: <BarChart3 className="w-5 h-5" />,
			label: "Analytics",
			description: "Performance insights",
		},
		{
			to: "/settings",
			icon: <Settings className="w-5 h-5" />,
			label: "Settings",
			description: "System configuration",
		},
	];

	const sidebarVariants = {
		open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
		closed: {
			x: "-100%",
			transition: { type: "spring", stiffness: 300, damping: 30 },
		},
	};

	return (
		<div className="flex h-screen w-full">
			{/* Mobile Menu Button */}
			<motion.button
				className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
				onClick={() => setSidebarOpen(!sidebarOpen)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				aria-label="Toggle menu">
				{sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
			</motion.button>

			{/* Sidebar - Mobile & Desktop */}
			<AnimatePresence>
				{(sidebarOpen || window.innerWidth >= 768) && (
					<motion.aside
						className={`z-40 md:z-10 w-72 min-w-[18rem] h-full bg-gradient-to-b from-indigo-600 to-purple-700 text-white flex flex-col`}
						initial={{ x: -300 }}
						animate={{ x: 0 }}
						exit={{ x: -300 }}
						transition={{ type: "spring", stiffness: 260, damping: 20 }}>
						<div className="text-2xl font-bold px-6 py-6 bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
							ADK Content Studio
						</div>

						<nav className="flex flex-col gap-2 px-4">
							{navigationItems.map((item, index) => (
								<NavLink
									key={item.to}
									to={item.to}
									className={({ isActive }) =>
										`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-500 transition-all ${
											isActive ? "bg-indigo-600" : ""
										}`
									}
									onClick={() => setSidebarOpen(false)}>
									{item.icon}
									<div className="flex flex-col">
										<span className="font-semibold">{item.label}</span>
										<span className="text-xs opacity-70">
											{item.description}
										</span>
									</div>
								</NavLink>
							))}
						</nav>

						<div className="mt-auto px-6 py-4 border-t border-white border-opacity-20">
							<div className="flex items-center gap-3">
								<div className="bg-white text-indigo-600 font-bold rounded-full h-10 w-10 flex items-center justify-center">
									AA
								</div>
								<div>
									<div className="font-semibold">Admin User</div>
									<div className="text-sm opacity-70">admin@example.com</div>
								</div>
							</div>
						</div>
					</motion.aside>
				)}
			</AnimatePresence>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-auto bg-gray-50">
				{/* Top Bar */}
				<motion.div
					className="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}>
					<h1 className="text-xl font-bold text-gray-800">
						ADK Content Studio
					</h1>

					<div className="flex items-center gap-4">
						<motion.div
							className="hidden md:flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300"
							whileHover={{ scale: 1.02 }}>
							<SearchIcon className="w-4 h-4 text-gray-500 mr-2" />
							<input
								type="text"
								placeholder="Search content..."
								className="bg-transparent border-none outline-none text-sm placeholder-gray-500 w-48"
							/>
						</motion.div>

						<motion.button
							className="relative p-2 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
							whileHover={{ scale: 1.05 }}
							aria-label="Notifications">
							<Bell className="w-5 h-5 text-gray-600" />
							<motion.span
								className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
							/>
						</motion.button>

						<motion.button
							className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
							whileHover={{ scale: 1.02 }}>
							<Sparkles className="w-4 h-4" />
							<span className="hidden sm:inline">New Content</span>
						</motion.button>
					</div>
				</motion.div>

				{/* Page Content */}
				<motion.div
					className="p-6 overflow-y-auto"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}>
					{children ?? <Outlet />}
				</motion.div>
			</div>
		</div>
	);
};

export default Layout;
