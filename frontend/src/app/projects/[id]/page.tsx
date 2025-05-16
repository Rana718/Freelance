"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Calendar,
    Loader2,
    Tag,
    DollarSign,
    ArrowLeft,
    CheckCircle,
    Clock,
    Send,
    Heart,
    Delete,
} from "lucide-react";
import Link from "next/link";
import { useProjectStore } from "@/store/projectStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { apiClient, Comment } from "@/lib/api";

export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const { currentProject, isLoading, error, fetchProject, markAsCompleted } =
        useProjectStore();
    const { data: session } = useSession();
    const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
    const [comment, setComment] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const isOwner = session?.user?.id === currentProject?.user_id;

    useEffect(() => {
        if (params.id) {
            fetchProject(params.id as string);
        }
        return () => {
            useProjectStore.getState().resetState();
        };
    }, [params.id]);
    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const projectData = await apiClient.fetchProject(
                    params.id as string,
                );
                setComments(projectData.comments || []);
                setLikeCount(projectData.likes || 0);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };

        if (params.id) {
            fetchProjectDetails();
        }
    }, [params.id, session?.user?.id]);

    const handleMarkCompleted = async () => {
        if (!session) {
            router.push("/sign-in");
            return;
        }

        if (!isOwner) {
            return;
        }

        setIsMarkingCompleted(true);
        try {
            await markAsCompleted(params.id as string);
        } finally {
            setIsMarkingCompleted(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!session || !isOwner) return;

        try {
            await apiClient.deleteProject(params.id as string);
            router.push("/projects");
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            router.push("/login");
            return;
        }

        if (!comment.trim()) return;

        try {
            setSubmittingComment(true);

            // Make API call to add comment
            const newCommentResponse = await apiClient.addComment(
                params.id as string,
                comment,
            );

            // Add comment to local state
            setComments((prevComments) => [
                ...prevComments,
                newCommentResponse,
            ]);
            setComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleLikeToggle = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        try {
            // Optimistic update
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

            // Make API call
            const response = await apiClient.toggleProjectLike(
                params.id as string,
            );
            // Update state with actual server response
            setLiked(response.liked);
            setLikeCount(response.likes);
        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert optimistic update on error
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
        }
    };
    // Change displayed image
    const handleImageChange = (index: number) => {
        setCurrentImageIndex(index);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold">Error</h2>
                <p className="mt-2 text-red-500">{error}</p>
                <Link
                    href="/projects"
                    className="mt-4 inline-flex items-center font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
                </Link>
            </div>
        );
    }

    if (!currentProject) {
        return (
            <div className="container mx-auto px-4 py-16 text-center sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold">Project not found</h2>
                <Link
                    href="/projects"
                    className="mt-4 inline-flex items-center font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
                <Link
                    href="/projects"
                    className="inline-flex items-center font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
                </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Main content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2"
                >
                    <div className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
                        <div className="relative border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-gray-700 dark:from-blue-900/20 dark:to-indigo-900/20">
                            <div className="absolute right-6 top-6 flex items-center gap-2">
                                {isOwner && (
                                    <button
                                        onClick={handleDeleteProject}
                                        className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                    >
                                        <Delete className="w-5 h-6" />
                                    </button>
                                )}
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        currentProject.status === "OPEN"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    {currentProject.status}
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {currentProject.title}
                            </h1>
                            <p className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="mr-1 h-4 w-4" />
                                Posted on{" "}
                                {formatDate(currentProject.created_at)}
                            </p>
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-semibold">
                                Project Description
                            </h2>
                            <p className="mt-4 whitespace-pre-line text-gray-700 dark:text-gray-300">
                                {currentProject.description}
                            </p>

                            <div className="mt-8">
                                <h3 className="flex items-center text-lg font-semibold">
                                    <Tag className="mr-2 h-5 w-5" />
                                    Required Technologies
                                </h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {currentProject.tech_stack.map(
                                        (tech, index) => (
                                            <span
                                                key={index}
                                                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                            >
                                                {tech}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="sticky top-24 space-y-6">
                        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
                            <h3 className="text-lg font-semibold">
                                Project Details
                            </h3>

                            <div className="mt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center text-gray-600 dark:text-gray-400">
                                        <DollarSign className="mr-2 h-5 w-5" />
                                        Budget
                                    </span>
                                    <span className="font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(currentProject.budget)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center text-gray-600 dark:text-gray-400">
                                        {currentProject.status === "OPEN" ? (
                                            <Clock className="mr-2 h-5 w-5" />
                                        ) : (
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                        )}
                                        Status
                                    </span>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            currentProject.status === "OPEN"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        {currentProject.status}
                                    </span>
                                </div>
                            </div>

                            {currentProject.status === "OPEN" && isOwner && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleMarkCompleted}
                                        disabled={isMarkingCompleted}
                                        className="flex w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 font-medium text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                                    >
                                        {isMarkingCompleted ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                        )}
                                        Mark as Completed
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mt-8">
                <div className="md:col-span-2">
                    {currentProject.images &&
                    currentProject.images.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800"
                        >
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={
                                        currentProject.images[currentImageIndex]
                                    }
                                    alt={currentProject.title}
                                    className="h-full w-full object-cover"
                                    width={800}
                                    height={450}
                                />
                            </div>

                            {currentProject.images.length > 1 && (
                                <div className="flex p-2">
                                    {currentProject.images.map(
                                        (image, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    handleImageChange(index)
                                                }
                                                className={`mr-2 h-16 w-16 overflow-hidden rounded-md border-2 ${
                                                    currentImageIndex === index
                                                        ? "border-blue-500"
                                                        : "border-transparent"
                                                }`}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                    width={64}
                                                    height={64}
                                                />
                                            </button>
                                        ),
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ) : null}

                    {/* Comments Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                Comments ({comments.length})
                            </h2>

                            <button
                                onClick={handleLikeToggle}
                                className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                                    liked
                                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                            >
                                {liked ? (
                                    <Heart className="h-4 w-4 fill-current" />
                                ) : (
                                    <Heart className="h-4 w-4" />
                                )}
                                <span>{likeCount}</span>
                            </button>
                        </div>

                        {/* Comment Form */}
                        {session?.user ? (
                            <form
                                onSubmit={handleCommentSubmit}
                                className="mb-6"
                            >
                                <div className="flex">
                                    <div className="mr-3 flex-shrink-0">
                                        {session.user.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt={
                                                    session.user.name || "User"
                                                }
                                                className="h-8 w-8 rounded-full"
                                                width={32}
                                                height={32}
                                            />
                                        ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    {session.user.name?.charAt(
                                                        0,
                                                    ) || "U"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            value={comment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                            placeholder="Add a comment..."
                                            className="w-full rounded-full border-0 py-2 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                submittingComment ||
                                                !comment.trim()
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600 disabled:opacity-50 dark:text-gray-400 dark:hover:text-blue-400"
                                        >
                                            {submittingComment ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Send className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-700">
                                <p className="text-gray-700 dark:text-gray-300">
                                    <Link
                                        href="/sign-in"
                                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Sign in
                                    </Link>{" "}
                                    to leave a comment
                                </p>
                            </div>
                        )}

                        {/* Comments List */}
                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    No comments yet. Be the first to comment!
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex">
                                        <div className="mr-3 flex-shrink-0">
                                            {comment.user.image ? (
                                                <Image
                                                    src={comment.user.image}
                                                    alt={comment.user.name}
                                                    className="h-8 w-8 rounded-full"
                                                    width={32}
                                                    height={32}
                                                />
                                            ) : (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                        {comment.user.name.charAt(
                                                            0,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                                <div className="mb-1">
                                                    <span className="font-medium">
                                                        {comment.user.name}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {comment.text}
                                                </p>
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {new Date(
                                                    comment.created_at,
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
