"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code, DollarSign, Briefcase, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-16 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
          <div className="h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
            >
              <span className="block">Find Your Next</span>
              <span className="mt-1 block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Freelance Project
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 max-w-lg text-center text-xl text-gray-600 dark:text-gray-300"
            >
              Connect with clients looking for your skills. Browse projects or post your own in just a few clicks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700"
              >
                Browse Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/post"
                className="inline-flex items-center justify-center rounded-md border border-blue-600 bg-transparent px-6 py-3 text-base font-medium text-blue-600 transition-all hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
              >
                Post a Project
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Wave SVG separator */}
        <div className="relative h-16 w-full">
          <svg
            className="absolute bottom-0 h-16 w-full"
            preserveAspectRatio="none"
            viewBox="0 0 1440 54"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 27L48 26C96 25 192 23 288 20.3C384 17.7 480 14.3 576 15.2C672 16 768 21 864 24.3C960 27.7 1056 29.3 1152 27.2C1248 25 1344 19 1392 16L1440 13V54H1392C1344 54 1248 54 1152 54C1056 54 960 54 864 54C768 54 672 54 576 54C480 54 384 54 288 54C192 54 96 54 48 54H0V27Z"
              fill="currentColor"
              className="fill-white dark:fill-gray-800"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Flancer?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              A modern platform for freelancers and clients to connect and collaborate
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl bg-white p-8 shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
              >
                <div className="absolute -top-4 left-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-2 text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-3 max-w-lg text-lg text-blue-100">
                Join our community of freelancers and clients today. Find your next project or post one in minutes.
              </p>
            </div>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-lg transition-all hover:bg-gray-50"
              >
                Browse Projects
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-md border border-white bg-transparent px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/10"
              >
                Sign Up For Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Code,
    title: "Find Technical Projects",
    description: "Browse through a wide variety of technical projects looking for your specific skills and expertise.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Clear budget information upfront. No hidden fees or surprises when working on projects.",
  },
  {
    icon: Briefcase,
    title: "Post Your Projects",
    description: "Easily post your own projects and connect with skilled freelancers ready to help.",
  },
  {
    icon: CheckCircle,
    title: "Seamless Experience",
    description: "Modern interface with a smooth user experience, making project management a breeze.",
  },
];