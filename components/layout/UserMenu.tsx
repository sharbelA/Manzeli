"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui";
import { logoutAction } from "@/app/_actions/auth";
import type { CurrentUser } from "@/app/_actions/auth";

export default function UserMenu({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  type Item =
    | { kind: "header"; label: string }
    | { kind: "link"; label: string; href: string; bold?: boolean }
    | { kind: "divider" }
    | { kind: "logout"; label: string };

  const items: Item[] = user
    ? user.role === "admin"
      ? [
          { kind: "header", label: `Hi, ${user.name}` },
          { kind: "link", label: "Admin dashboard", href: "/admin", bold: true },
          { kind: "link", label: "All chalets", href: "/admin/listings" },
          { kind: "divider" },
          { kind: "link", label: "Browse site", href: "/" },
          { kind: "link", label: "About", href: "/about" },
          { kind: "divider" },
          { kind: "logout", label: "Log out" },
        ]
      : [
          { kind: "header", label: `Hi, ${user.name}` },
          { kind: "link", label: "Host dashboard", href: "/host/dashboard", bold: true },
          { kind: "divider" },
          { kind: "link", label: "Browse site", href: "/" },
          { kind: "link", label: "About", href: "/about" },
          { kind: "divider" },
          { kind: "logout", label: "Log out" },
        ]
    : [
        { kind: "link", label: "Host login", href: "/host/login", bold: true },
        { kind: "link", label: "Admin", href: "/admin/login" },
        { kind: "divider" },
        { kind: "link", label: "List your property", href: "/list-your-chalet" },
        { kind: "link", label: "Browse chalets", href: "/chalets" },
        { kind: "link", label: "About", href: "/about" },
      ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-[var(--border)] rounded-full px-3 py-2 hover:shadow-md transition-shadow duration-200"
      >
        <Icon name="menu" size={16} />
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${user ? "bg-[var(--accent)]" : "bg-[var(--muted)]"}`}>
          {user ? (
            <span className="text-white text-xs font-semibold">{user.name.charAt(0).toUpperCase()}</span>
          ) : (
            <Icon name="user" size={14} fill="white" stroke="none" />
          )}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-[var(--border-light)] rounded-xl shadow-lg py-2 w-60 z-50">
          {items.map((item, i) => {
            if (item.kind === "divider") {
              return <div key={i} className="border-t border-[var(--border-light)] my-1" />;
            }
            if (item.kind === "header") {
              return (
                <div key={i} className="px-4 py-2 text-xs uppercase tracking-wider text-[var(--muted)]">
                  {item.label}
                </div>
              );
            }
            if (item.kind === "logout") {
              return (
                <form key={i} action={logoutAction}>
                  <button type="submit" className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--surface)] transition-colors">
                    {item.label}
                  </button>
                </form>
              );
            }
            return (
              <Link
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm hover:bg-[var(--surface)] transition-colors ${item.bold ? "font-semibold" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
