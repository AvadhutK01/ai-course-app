import apiClient from './apiClient';

export interface CourseInputResponse {
  message: string;
  input: string;
  data: {
    topic: string;
    summary: string;
    learning_plan: string[];
    videos: any[];
  };
}

const courseService = {
  searchCourse: async (input: string): Promise<CourseInputResponse> => {
    try {
      console.log({input});
      const response = await apiClient.post<CourseInputResponse>('/api/course/input', {
        input: input,
      });
      return response.data;
    } catch (error) {
      console.error('Error searching course:', error);
      throw error;
    }
  },
};

export default courseService;
