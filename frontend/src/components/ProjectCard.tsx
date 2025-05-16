"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import { Project } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const likeCount = project.likes ?? 0;
  const commentCount = project.comments?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:backdrop-blur-sm"
    >
      <div className="flex flex-col">
        {/* Project Image */}
        {Array.isArray(project.images) && project.images.length > 0 && (
          <img
            src={project.images[0]}
            alt={`${project.title} image`}
            className="h-40 w-full rounded-md object-cover"
          />
        )}

        {/* Title & Status */}
        <div className="flex items-center justify-between pt-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
            {project.title}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${project.status === "OPEN"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
          >
            {project.status}
          </span>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.tech_stack.map((tech, i) => (
            <span
              key={i}
              className=" rounded-sm bg-blue-100 px-2 py-0.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Budget & View Link */}
        <div className="flex items-center justify-between pt-5">
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            {formatCurrency(project.budget)}
          </span>
          <Link
            href={`/projects/${project.id}`}
            className="group inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:gap-1.5 dark:text-blue-400"
          >
            View
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Likes & Comments */}
        <div className="mt-1 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{commentCount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
