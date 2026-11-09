const API_BASE_URL = '/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('vaani_token');
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    // Only set Content-Type to application/json if body is not FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (res.status === 401) {
      // Clear token if expired or unauthorized
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        localStorage.removeItem('vaani_token');
        localStorage.removeItem('vaani_user');
        window.location.href = '/login';
      }
    }

    // Handle binary responses (e.g. TTS audio/wav)
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('audio/wav') || contentType.includes('application/octet-stream')) {
      if (!res.ok) throw new Error('Audio generation failed');
      const blob = await res.blob();
      return blob as any;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: Failed to process request`);
    }

    return data;
  }

  // Auth Endpoints
  public register(payload: any) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  }

  public login(payload: any) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  }

  public getMe() {
    return this.request('/auth/me');
  }

  public updateOnboarding(payload: any) {
    return this.request('/auth/onboarding', { method: 'PUT', body: JSON.stringify(payload) });
  }

  // Assistant Endpoints
  public sendAssistantMessage(payload: { text: string; conversationId?: string; language?: string; generateVoice?: boolean }) {
    return this.request('/assistant/message', { method: 'POST', body: JSON.stringify(payload) });
  }

  public sendAssistantVoice(formData: FormData) {
    return this.request('/assistant/voice', { method: 'POST', body: formData });
  }

  public getConversations(page = 1, limit = 20) {
    return this.request(`/assistant/conversations?page=${page}&limit=${limit}`);
  }

  public getConversationById(id: string) {
    return this.request(`/assistant/conversations/${id}`);
  }

  public deleteConversation(id: string) {
    return this.request(`/assistant/conversations/${id}`, { method: 'DELETE' });
  }

  // Voice Endpoints
  public getVoiceConfig() {
    return this.request('/voice/config');
  }

  public synthesizeTTS(payload: { text: string; voice?: string; language?: string; speed?: number }) {
    return this.request<Blob>('/voice/tts', { method: 'POST', body: JSON.stringify(payload) });
  }

  // Learning Endpoints
  public getLearningProfile() {
    return this.request('/learning/profile');
  }

  public updateLearningProfile(payload: any) {
    return this.request('/learning/profile', { method: 'PUT', body: JSON.stringify(payload) });
  }

  public getLearningScenarios(params?: { category?: string; level?: string; language?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/learning/scenarios?${query}`);
  }

  public createLearningSession(scenarioId: string) {
    return this.request('/learning/session', { method: 'POST', body: JSON.stringify({ scenarioId }) });
  }

  public sendSessionMessage(sessionId: string, text: string) {
    return this.request(`/learning/session/${sessionId}/message`, { method: 'POST', body: JSON.stringify({ text }) });
  }

  public completeLearningSession(sessionId: string) {
    return this.request(`/learning/session/${sessionId}/complete`, { method: 'POST' });
  }

  public getLearningProgress() {
    return this.request('/learning/progress');
  }

  // Notes Endpoints
  public getNotes() {
    return this.request('/notes');
  }

  public createNote(payload: { title: string; content?: string; tags?: string[] }) {
    return this.request('/notes', { method: 'POST', body: JSON.stringify(payload) });
  }

  public deleteNote(id: string) {
    return this.request(`/notes/${id}`, { method: 'DELETE' });
  }

  // Tasks Endpoints
  public getTasks(status?: string) {
    return this.request(`/tasks${status ? `?status=${status}` : ''}`);
  }

  public createTask(payload: { title: string; description?: string; dueDate?: string; priority?: string }) {
    return this.request('/tasks', { method: 'POST', body: JSON.stringify(payload) });
  }

  public updateTask(id: string, payload: any) {
    return this.request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  }

  public deleteTask(id: string) {
    return this.request(`/tasks/${id}`, { method: 'DELETE' });
  }

  // Settings Endpoints
  public getSettings() {
    return this.request('/settings');
  }

  public updateSettings(payload: any) {
    return this.request('/settings', { method: 'PUT', body: JSON.stringify(payload) });
  }

  public clearMemory() {
    return this.request('/settings/clear-memory', { method: 'POST' });
  }
}

export const api = new ApiService();

