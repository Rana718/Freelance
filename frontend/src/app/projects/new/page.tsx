"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Loader2,
    Save,
    ArrowLeft,
    X,
    Plus,
    Upload,
    ImageIcon,
    DollarSign,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import UploadButton from "@/components/UploadButton";

export default function NewProjectPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [techStack, setTechStack] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [uploadingImages, setUploadingImages] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        }
    }, [status, router]);

    useEffect(() => {
        console.log("jwt", session?.user?.accessToken);
    }, [session]);

    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Process tech stack into array
        const techStackArray = techStack
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);

        try {
            // This would be implemented in the API client
            // Currently just mock data
            await apiClient.createProject({
                title,
                description,
                budget: parseFloat(budget),
                tech_stack: techStackArray,
                images,
            });

            // Redirect to projects page
            router.push("/projects");
        } catch (error) {
            console.error("Error creating project:", error);
            setError("Failed to create project. Please try again.");
        } finally {
            setIsLoading(false);
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
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <div className="mb-6 flex items-center">
                <Link
                    href="/projects"
                    className="mr-4 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Projects
                </Link>
                <h1 className="text-2xl font-bold">Create New Project</h1>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800"
            >
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="mb-1 block text-sm font-medium"
                        >
                            Project Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                            placeholder="e.g., E-commerce Website Development"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="mb-1 block text-sm font-medium"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            className="block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                            placeholder="Describe your project in detail..."
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="budget"
                            className="mb-1 block text-sm font-medium"
                        >
                            Budget (₹)
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                id="budget"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                                placeholder="5000"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="tech-stack"
                            className="mb-1 block text-sm font-medium"
                        >
                            Tech Stack (comma separated)
                        </label>
                        <input
                            type="text"
                            id="tech-stack"
                            value={techStack}
                            onChange={(e) => setTechStack(e.target.value)}
                            className="block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                            placeholder="e.g., React, Node.js, MongoDB"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium">
                            Project Images (Max 3)
                        </label>

                        <UploadButton
                            endpoint="projectImages"
                            value={images}
                            onChange={setImages}
                            maxFiles={3}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Project
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
