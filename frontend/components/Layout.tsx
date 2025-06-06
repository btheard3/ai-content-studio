// frontend/components/Layout.tsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Settings, Workflow, BarChart3, LayoutDashboard } from "lucide-react";

const navItems = [
	{ path: "/", name: "Dashboard", icon: <LayoutDashboard size={18} /> },
	{ path: "/workflow", name: "Workflow", icon: <Workflow size={18} /> },
	{ path: "/analytics", name: "Analytics", icon: <BarChart3 size={18} /> },
	{ path: "/settings", name: "Settings", icon: <Settings size={18} /> },
];

export default function Layout() {
	return (
		<div className="layout-container">
			<aside className="sidebar">
				<div className="brand">ADK Content</div>
				<nav className="nav-links">
					{navItems.map((item) => (
						<NavLink
							key={item.name}
							to={item.path}
							className={({ isActive }) =>
								isActive ? "nav-link active" : "nav-link"
							}>
							{item.icon}
							<span>{item.name}</span>
						</NavLink>
					))}
				</nav>
				<div className="sidebar-footer">
					<div className="admin">
						<div className="avatar">AA</div>
						<div className="info">
							<strong>Admin User</strong>
							<span>admin@example.com</span>
						</div>
					</div>
				</div>
			</aside>
			<main className="main-content">
				<header className="top-bar">
					<h1 className="top-title">ADK Content Studio</h1>
				</header>
				<div className="main-scroll-area">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
