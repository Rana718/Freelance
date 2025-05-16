"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Save, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { apiClient } from "@/lib/api";

export default function EditProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
        }
    }, [session]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");

        try {
            await update({ name });
            router.push("/profile");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-xl px-4 py-8">
            <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href="/profile"
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Profile
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Profile
                </h1>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800"
            >
                {error && (
                    <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full">
                            {session?.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || "Profile"}
                                    className="h-full w-full object-cover"
                                    width={128}
                                    height={128}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                                    <User className="h-16 w-16 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Display Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="bio"
                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
