import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage = error instanceof AxiosError 
          ? error.response?.data?.detail || error.message
          : error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred';
        
        setState({ data: null, loading: false, error: errorMessage });
        console.error('API Error:', error);
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
}

// API service functions
export const apiService = {
  runWorkflow: async (data: { text: string; workflow_type?: string }) => {
    const response = await axios.post('http://localhost:8000/run_workflow', data);
    return response.data;
  },

  runTask: async (data: { inputs: { user_prompt: string; text: string; title: string } }) => {
    const response = await axios.post('http://localhost:8000/run_task', data);
    return response.data;
  },

  runVideoWorkflow: async (data: { user_prompt: string; title?: string }) => {
    const response = await axios.post('http://localhost:8000/run_video_workflow', data);
    return response.data;
  },

  runAgent: async (agentId: string, data: { text: string }) => {
    const response = await axios.post(`http://localhost:8000/run/${agentId}`, data);
    return response.data;
  },

  generateElaiVideo: async (data: {
    text: string;
    title?: string;
    template_id?: string;
    voice_id?: string;
  }) => {
    const response = await axios.post('http://localhost:8000/generate_elai_video', data);
    return response.data;
  },

  generateVideo: async (data: {
    text: string;
    title?: string;
    template_id?: string;
    voice_id?: string;
  }) => {
    const response = await axios.post('http://localhost:8000/generate_video', data);
    return response.data;
  },

  generateTavusVideo: async (data: {
    script: string;
    title: string;
  }) => {
    const response = await axios.post('http://localhost:8000/generate_tavus_video', data);
    return response.data;
  },

  generateCode: async (data: {
    description: string;
    language: string;
    framework?: string;
    complexity?: string;
    include_tests?: boolean;
  }) => {
    const response = await axios.post('http://localhost:8000/generate_code', data);
    return response.data;
  },

  searchResearch: async (data: {
    query: string;
    filters?: any;
    user_id?: string;
  }) => {
    const response = await axios.post(
      'http://localhost:8000/api/research/search',
      data,
      { headers: { Authorization: 'Bearer dummy-token' } }
    );
    return response.data;
  },

  getWorkflowInfo: async () => {
    const response = await axios.get('http://localhost:8000/workflow/info');
    return response.data;
  },

  getAgents: async () => {
    const response = await axios.get('http://localhost:8000/agents');
    return response.data;
  },

  getResearchAnalytics: async (days: number = 30) => {
    const response = await axios.get(
      `http://localhost:8000/api/research/analytics?days=${days}`,
      { headers: { Authorization: 'Bearer dummy-token' } }
    );
    return response.data;
  },

  getElaiTemplates: async () => {
    const response = await axios.get('http://localhost:8000/elai/templates');
    return response.data;
  },

  getElaiVoices: async () => {
    const response = await axios.get('http://localhost:8000/elai/voices');
    return response.data;
  },

  getVideoTemplates: async () => {
    const response = await axios.get('http://localhost:8000/video/templates');
    return response.data;
  },

  getVideoVoices: async () => {
    const response = await axios.get('http://localhost:8000/video/voices');
    return response.data;
  },

  getCodeTemplates: async () => {
    const response = await axios.get('http://localhost:8000/code/templates');
    return response.data;
  },

  getCodeHistory: async () => {
    const response = await axios.get('http://localhost:8000/code/history');
    return response.data;
  },
};