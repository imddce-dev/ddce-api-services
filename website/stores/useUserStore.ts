import { create } from 'zustand';
import apiClient  from '@/services/apiConfig';

interface UserProfile {
  id: number,
  name: string,
  username: string,
  email: string,
  phone: string,
  organizerId: string,
  organizerName: string ; 
}

interface UserState {
    userProfile: UserProfile | null;
    isLoading: boolean;
    fetchUserProfile: () => Promise<void>; 
    clearUserProfile: () => void; 
}

export const useUserStore = create<UserState>((set) => ({
    userProfile: null,
    isLoading: true,
    fetchUserProfile: async () => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get('/auth/profile'); 
            set({ userProfile: response.data.data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            set({ userProfile: null, isLoading: false });
        }
    },
    clearUserProfile: () => set({ userProfile: null }),
}));