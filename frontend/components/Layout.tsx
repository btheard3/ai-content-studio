import React from "react";
import { NavLink, Outlet } from "react-router-dom";

type LayoutProps = {
	children?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="layout-container">
			<aside className="sidebar">
				<div>
					<div className="brand">🧠 ADK Content</div>
					<nav className="nav-links">
						<NavLink to="/" className="nav-link">
							Dashboard
						</NavLink>
						<NavLink to="/workflow" className="nav-link">
							Workflow
						</NavLink>
						<NavLink to="/analytics" className="nav-link">
							Analytics
						</NavLink>
						<NavLink to="/settings" className="nav-link">
							Settings
						</NavLink>
					</nav>
				</div>
				<div className="sidebar-footer">
					<div className="admin">
						<div className="avatar">AA</div>
						<div className="info">
							<span>Admin User</span>
							<span>admin@example.com</span>
						</div>
					</div>
				</div>
			</aside>
			<main className="main-content">
				<div className="top-bar">
					<h1 className="top-title">ADK Content Studio</h1>
					<button className="btn-primary">+ New Content</button>
				</div>
				<div className="main-scroll-area">{children ?? <Outlet />}</div>
			</main>
		</div>
	);
};

export default Layout;
