"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Moon, Sun, Menu, X, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useThemeStore } from "@/lib/theme";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { theme, toggleTheme, setTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    const isAuthRoute =
        pathname?.includes("/sign-in") || pathname?.includes("/sign-up");

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("theme-storage");
        if (savedTheme) {
            const parsedTheme = JSON.parse(savedTheme);
            setTheme(parsedTheme.state.theme);
        } else {
            const isDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
            setTheme(isDark ? "dark" : "light");
        }
    }, [setTheme]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isAuthRoute) return null;

    const navLinks = [{ name: "Home", href: "/projects" }];

    if (!mounted) {
        return (
            <header className="fixed left-0 right-0 top-0 z-50 bg-transparent">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Flancer
                    </span>
                </div>
            </header>
        );
    }

    return (
        <header
            className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/80 shadow-sm backdrop-blur-md dark:bg-gray-900/80"
                    : "bg-transparent"
            }`}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                >
                    Flancer
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${
                                pathname === link.href
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {!session?.user ? (
                        <Link
                            href="/sign-in"
                            className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:from-blue-700 hover:to-indigo-700"
                        >
                            Sign In
                        </Link>
                    ) : (
                        <Link
                            href={`/profile/`}
                            className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            <User className="h-5 w-5" />
                            <span>{session.user.name}</span>
                        </Link>
                    )}

                    <button
                        onClick={toggleTheme}
                        className="h-9 w-9 rounded-md flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5 text-yellow-400" />
                        ) : (
                            <Moon className="h-5 w-5 text-slate-700" />
                        )}
                    </button>
                </nav>

                <div className="md:hidden flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="h-9 w-9 rounded-md flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5 text-yellow-400" />
                        ) : (
                            <Moon className="h-5 w-5 text-slate-700" />
                        )}
                    </button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="h-9 w-9 rounded-md flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t bg-white dark:bg-gray-900 dark:border-gray-800"
                >
                    <div className="space-y-1 px-4 py-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block rounded-md px-3 py-2 text-base font-medium ${
                                    pathname === link.href
                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {!session?.user ? (
                            <Link
                                href="/sign-in"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-center text-base font-medium text-white hover:from-blue-700 hover:to-indigo-700"
                            >
                                Sign In
                            </Link>
                        ) : (
                            <Link
                                href={`/profile/${session.user.id}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                            >
                                <User className="h-5 w-5" />
                                <span>{session.user.name}</span>
                            </Link>
                        )}
                    </div>
                </motion.div>
            )}
        </header>
    );
}
