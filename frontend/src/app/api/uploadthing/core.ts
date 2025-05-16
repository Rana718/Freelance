import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { GET as nextAuthHandler } from "@/app/api/auth/[...nextauth]/route";

const f = createUploadthing();

export const ourFileRouter = {
    profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            const session = (await getServerSession(nextAuthHandler)) as {
                user: { id: string };
            } | null;
            if (!session) throw new Error("Unauthorized");
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            return { uploadedBy: metadata.userId, imageUrl: file.ufsUrl };
        }),

    projectImages: f({ image: { maxFileSize: "4MB", maxFileCount: 3 } })
        .middleware(async () => {
            const session = (await getServerSession(nextAuthHandler)) as {
                user: { id: string };
            } | null;
            if (!session) throw new Error("Unauthorized");
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log(
                "Project image upload complete for userId:",
                metadata.userId,
            );
            return { uploadedBy: metadata.userId, imageUrl: file.ufsUrl };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
