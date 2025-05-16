"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, Filter, X } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { useProjectStore } from "@/store/projectStore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
    const {
        projects,
        isLoading,
        error,
        filters,
        fetchProjects,
        setFilters,
        setPage,
        pagination,
    } = useProjectStore();
    const { data: session } = useSession();
    const router = useRouter();

    const [techStack, setTechStack] = useState(filters.tech_stack || "");
    const [minBudget, setMinBudget] = useState(
        filters.min_budget?.toString() || "",
    );
    const [maxBudget, setMaxBudget] = useState(
        filters.max_budget?.toString() || "",
    );
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        fetchProjects();
        return () => {
            useProjectStore.getState().resetState();
        };
    }, []);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({
            tech_stack: techStack,
            min_budget: minBudget ? parseInt(minBudget) : undefined,
            max_budget: maxBudget ? parseInt(maxBudget) : undefined,
        });
    };

    const handleClearFilters = () => {
        setTechStack("");
        setMinBudget("");
        setMaxBudget("");
        setFilters({});
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setPage(page);
    };
    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold sm:text-3xl">Projects</h1>
                {session?.user && (
                    <Link
                        href="/projects/new"
                        className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700"
                    >
                        Create New Project
                    </Link>
                )}
            </div>
            {/* Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 sticky top-[72px] z-10 backdrop-blur-md"
            >
                <form
                    onSubmit={handleFilterSubmit}
                    className="flex flex-wrap md:flex-nowrap items-center gap-3 p-3 rounded-xl bg-white/80 dark:bg-gray-800/90 shadow-md"
                >
                    <div className="flex-1 min-w-[180px]">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="tech-stack"
                                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                placeholder="Technologies (e.g., React, Node.js)"
                                value={techStack}
                                onChange={(e) => setTechStack(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row gap-3 w-full md:w-auto">
                        <input
                            type="number"
                            id="min-budget"
                            min="0"
                            className="flex-1 min-w-[100px] rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            placeholder="Min ₹"
                            value={minBudget}
                            onChange={(e) => setMinBudget(e.target.value)}
                        />

                        <input
                            type="number"
                            id="max-budget"
                            min="0"
                            className="flex-1 min-w-[100px] rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            placeholder="Max ₹"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 md:ml-2">
                        {(techStack || minBudget || maxBudget) && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="rounded-lg border border-gray-200 bg-white/90 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        <button
                            type="submit"
                            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Filter className="h-4 w-4" />
                        </button>
                    </div>
                </form>
            </motion.div>{" "}
            {/* Project list or state */}
            <div>
                {isLoading ? (
                    <div className="flex h-60 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : error ? (
                    <div className="flex h-60 items-center justify-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex h-60 flex-col items-center justify-center space-y-2 border border-dashed rounded-xl p-6 text-center dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
                        <p className="text-gray-500 dark:text-gray-400">
                            No projects found
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Try adjusting your filters
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                            >
                                <ProjectCard project={project} index={index} />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && projects.length > 12 && (
                    <div className="mt-12 flex justify-center">
                        <nav className="flex gap-4 items-center rounded-lg bg-white/80 dark:bg-gray-800/80 p-2 shadow-sm backdrop-blur-sm">
                            <button
                                onClick={() =>
                                    currentPage > 0 &&
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 0}
                                className="rounded-md border border-gray-200 bg-white/90 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-gray-700 dark:bg-gray-700/90 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-sm font-medium px-2">
                                {currentPage + 1}
                            </span>
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={projects.length < pagination.limit}
                                className="rounded-md border border-gray-200 bg-white/90 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-gray-700 dark:bg-gray-700/90 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}
