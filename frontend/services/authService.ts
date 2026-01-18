import apiClient from './apiClient';

export interface User {
  _id: string;
  email: string;
  displayName: string;
  image?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const authService = {
  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/google', {
        id_token: idToken,
      });
      return response.data;
    } catch (error) {
      console.error('Error during Google login API call:', error);
      throw error;
    }
  },
};

export default authService;
