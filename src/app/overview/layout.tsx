'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", href: "/overview" },
    { name: "Saving", href: "/overview/savings" },
    { name: "setGoals", href: "/overview/goals" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold">Expense Manager</h2>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.href} className="p-2">
              <Link
                href={item.href}
                className={`block ${
                  pathname === item.href
                    ? "bg-gray-700 font-bold"
                    : "hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
