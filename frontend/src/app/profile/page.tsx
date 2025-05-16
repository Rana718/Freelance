"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Loader2,
    LogOut,
    User,
    Edit,
    Upload,
    ThumbsUp,
    MessageCircle,
    Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { apiClient, Project } from "@/lib/api";
import UploadButton from "@/components/UploadButton";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        }
    }, [status, router]);

    // Fetch user projects
    useEffect(() => {
        const fetchUserProjects = async () => {
            if (status === "authenticated") {
                try {
                    setIsLoading(true);
                    const userProjects = await apiClient.fetchUserProjects();
                    setProjects(userProjects);
                } catch (error) {
                    console.error("Error fetching user projects:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchUserProjects();
    }, [status]);

    const handleProfileImageUpload = async (urls: string[]) => {
        if (!urls.length) return;

        try {
            setIsUploadingImage(true);
            await apiClient.uploadProfileImage(urls[0]);
            // Update session
            router.refresh();
        } catch (error) {
            console.error("Error uploading profile image:", error);
        } finally {
            setIsUploadingImage(false);
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-6 grid gap-4 sm:gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-1 rounded-xl bg-white p-4 shadow-md dark:bg-gray-800 sm:p-6"
                >
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full sm:h-32 sm:w-32">
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
                                        <User className="h-12 w-12 text-gray-400 sm:h-16 sm:w-16" />
                                    </div>
                                )}
                            </div>

                            {/* <div className="mt-4">
                <UploadButton
                  endpoint="profileImage"
                  value={[]}
                  onChange={handleProfileImageUpload}
                  maxFiles={1}
                />
              </div> */}
                        </div>

                        <h2 className="text-lg font-bold sm:text-xl">
                            {session?.user?.name}
                        </h2>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                            {session?.user?.email}
                        </p>

                        <div className="mt-2 flex w-full flex-col gap-2">
                            {/* <Link
                href="/profile/edit"
                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 sm:px-4 sm:py-2 sm:text-sm"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                Edit Profile
              </Link> */}

                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 sm:px-4 sm:py-2 sm:text-sm"
                            >
                                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats & Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-1 rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800 sm:p-4 md:col-span-2"
                >
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-base font-semibold sm:text-lg">
                            Your Activity
                        </h2>

                        <Link
                            href="/projects/new"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-700"
                        >
                            +
                        </Link>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 rounded bg-gray-50 px-2 py-2 text-center dark:bg-gray-700">
                            <h3 className="text-lg font-semibold text-blue-600">
                                {projects.length}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                Projects
                            </p>
                        </div>
                        <div className="flex-1 rounded bg-gray-50 px-2 py-2 text-center dark:bg-gray-700">
                            <h3 className="text-lg font-semibold text-blue-600">
                                0
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                Likes
                            </p>
                        </div>
                        <div className="flex-1 rounded bg-gray-50 px-2 py-2 text-center dark:bg-gray-700">
                            <h3 className="text-lg font-semibold text-blue-600">
                                0
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                Comments
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Projects Section */}
            <div className="mb-6">
                <h2 className="mb-4 text-lg font-bold sm:text-xl">
                    Your Projects
                </h2>

                {projects.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center dark:border-gray-700 sm:p-8">
                        <ImageIcon className="mb-2 h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            You haven't created any projects yet.
                        </p>
                        <Link
                            href="/projects/new"
                            className="mt-2 text-xs text-blue-600 hover:underline dark:text-blue-400 sm:text-sm"
                        >
                            Create your first project
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
        >
            {project.images && project.images[0] && (
                <div className="relative h-40 w-full overflow-hidden sm:h-48">
                    <Image
                        src={project.images[0]}
                        alt={project.title}
                        className="h-full w-full object-cover"
                        width={400}
                        height={200}
                    />
                </div>
            )}

            <div className="p-3 sm:p-4">
                <h3 className="mb-1.5 text-base font-semibold sm:mb-2 sm:text-lg">
                    {project.title}
                </h3>
                <p className="mb-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-300 sm:mb-3 sm:text-sm">
                    {project.description}
                </p>

                <div className="mb-2 flex flex-wrap gap-1.5 sm:mb-3">
                    {project.tech_stack.map((tech) => (
                        <span
                            key={tech}
                            className=" rounded-sm bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200 sm:px-2 sm:py-1"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="mt-3 flex items-center justify-between sm:mt-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 sm:text-sm">
                            <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{project.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 sm:text-sm">
                            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{project.comments?.length || 0}</span>
                        </button>
                    </div>

                    <Link
                        href={`/projects/${project.id}`}
                        className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 sm:text-sm"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
