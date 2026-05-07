"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoClient as Logo } from "./LogoClient";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-bg/85 border-b border-line shadow-soft"
          : "bg-transparent",
      )}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link href="/" aria-label="Inicio Singlufest" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {SITE.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] transition-all",
                item.emphasis
                  ? "btn-accent !px-5 ml-3"
                  : "text-ink/75 hover:text-brand-orange",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-full text-ink hover:bg-bg-alt"
          aria-label="Abrir menú"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-bg/95 backdrop-blur-md">
          <nav className="container py-4 flex flex-col gap-1">
            {SITE.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider",
                  item.emphasis
                    ? "bg-brand-orange text-bg"
                    : "text-ink hover:bg-bg-alt",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
