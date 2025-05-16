import axios from 'axios';
import { getSession, signIn, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API || 'http://localhost:8000';


const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = session?.user?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error("JWT token expired or invalid");
      if (typeof window !== 'undefined') {
        await signOut({ redirect: false });
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  tech_stack: string[];
  status: 'OPEN' | 'COMPLETED';
  created_at: string;
  likes?: number;
  user_id: string;
  images?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  created_at: string;
}

export interface ProjectCreate {
  title: string;
  description: string;
  budget: number;
  tech_stack: string[];
  images?: string[];
}

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
  image?: string;
  bio?: string;
}

export interface LoginData {
  username: string;  
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// API functions
export const apiClient = {
  // Projects
  fetchProjects: async (params?: {
    skip?: number;
    limit?: number;
    tech_stack?: string;
    min_budget?: number;
    max_budget?: number;
  }) => {
    const response = await api.get<Project[]>('/projects', { params });
    return response.data;
  },

  fetchProject: async (id: string) => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  createProject: async (project: ProjectCreate) => {
    try {
      const response = await api.post<Project>('/projects', project);
      return response.data;
    } catch (error) {
      console.error("Project creation error:", error);
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    const response = await api.delete<void>(`/projects/${id}`);
    return response.data;
  },

  updateProjectStatus: async (id: string, status: 'COMPLETED') => {
    const response = await api.patch<Project>(`/projects/${id}/status`, { status });
    return response.data;
  },

  // User projects
  fetchUserProjects: async () => {
    const response = await api.get<Project[]>('/projects/user');
    return response.data;
  },

  // Project likes
  toggleProjectLike: async (id: string) => {
    const response = await api.post<{ liked: boolean, likes: number }>(`/projects/${id}/like`);
    return response.data;
  },

  checkProjectLike: async (id: string) => {
    const response = await api.get<{ liked: boolean }>(`/projects/${id}/like`);
    return response.data.liked;
  },

  // Project comments
  addComment: async (id: string, text: string) => {
    const response = await api.post<Comment>(`/projects/${id}/comments`, { text });
    return response.data;
  },

  // User profile
  updateProfile: async (data: { name: string, bio?: string }) => {
    const response = await api.patch<User>('/auth/profile', data);
    return response.data;
  },

  uploadProfileImage: async (imageUrl: string) => {
    const response = await api.patch<User>('/auth/profile/image', { image_url: imageUrl });
    return response.data;
  },

  // Auth
  login: async (data: LoginData) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    
    const response = await api.post<AuthResponse>('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data.access_token) {
      await signIn("credentials", {
        email: data.username,
        password: data.password,
        redirect: false,
      });
    }
    
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout: async () => {
    await signOut({ redirect: false });
    window.location.href = '/sign-in';
  },
};

export default api; 