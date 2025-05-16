import { create } from "zustand";
import { apiClient, Project, ProjectCreate } from "@/lib/api";

interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    isLoading: boolean;
    error: string | null;
    filters: {
        tech_stack?: string;
        min_budget?: number;
        max_budget?: number;
    };
    pagination: {
        skip: number;
        limit: number;
        total: number;
    };

    fetchProjects: () => Promise<void>;
    fetchProject: (id: string) => Promise<void>;
    createProject: (project: ProjectCreate) => Promise<void>;
    markAsCompleted: (id: string) => Promise<void>;
    setFilters: (filters: ProjectState["filters"]) => void;
    setPage: (page: number) => void;
    resetState: () => void;
}

const DEFAULT_PAGINATION = {
    skip: 0,
    limit: 10,
    total: 0,
};

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,
    filters: {},
    pagination: DEFAULT_PAGINATION,

    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        const { filters, pagination } = get();

        try {
            const projects = await apiClient.fetchProjects({
                ...filters,
                skip: pagination.skip,
                limit: pagination.limit,
            });

            set({ projects, isLoading: false });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail || "Failed to fetch projects",
                isLoading: false,
            });
        }
    },

    fetchProject: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const project = await apiClient.fetchProject(id);
            set({ currentProject: project, isLoading: false });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail || "Failed to fetch project",
                isLoading: false,
            });
        }
    },

    createProject: async (project: ProjectCreate) => {
        set({ isLoading: true, error: null });

        try {
            await apiClient.createProject(project);
            set({ isLoading: false });
            // Refresh projects after creating a new one
            get().fetchProjects();
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail || "Failed to create project",
                isLoading: false,
            });
        }
    },

    markAsCompleted: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const updatedProject = await apiClient.updateProjectStatus(
                id,
                "COMPLETED",
            );

            // Update current project if it matches
            if (get().currentProject?.id === id) {
                set({ currentProject: updatedProject });
            }

            // Update project in projects list
            set((state) => ({
                projects: state.projects.map((p) =>
                    p.id === id ? updatedProject : p,
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.detail ||
                    "Failed to mark project as completed",
                isLoading: false,
            });
        }
    },

    setFilters: (filters) => {
        set({
            filters,
            pagination: { ...DEFAULT_PAGINATION }, // Reset pagination when filters change
        });
        get().fetchProjects();
    },

    setPage: (page: number) => {
        const { pagination } = get();
        set({
            pagination: {
                ...pagination,
                skip: page * pagination.limit,
            },
        });
        get().fetchProjects();
    },

    resetState: () => {
        set({
            projects: [],
            currentProject: null,
            filters: {},
            pagination: DEFAULT_PAGINATION,
        });
    },
}));
