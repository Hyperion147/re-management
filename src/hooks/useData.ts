import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { normalizeRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';

export type AdminRole = 'ADMIN' | 'SUPERADMIN' | 'USER' | null;

// Returns the current user's role from the public users table.
// Used to enforce role-based access in admin pages.
export function useAdminRole() {
  const [role, setRole] = useState<AdminRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        // /users/me handles auth internally — no need to pre-check the session
        const response = await api.get('/users/me');
        setRole(normalizeRole(response.data?.role ?? null));
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  const isSuperAdmin = role === 'SUPERADMIN';
  const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN';

  return { role, loading, isSuperAdmin, isAdmin };
}

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refresh: fetchUsers };
}

export function useRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requests');
      setRequests(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (data: any) => {
    const response = await api.post('/requests', data);
    fetchRequests(); // Refresh list
    return response.data;
  };

  const updateRequestStatus = async (id: string, status?: string, agentId?: string) => {
    try {
      setLoading(true);
      const payload: any = {};
      if (status) payload.status = status;
      if (agentId) payload.agentId = agentId;
      
      const response = await api.patch(`/requests/${id}`, payload);
      await fetchRequests(); // Refresh list after update
      return response.data;
    } catch (err) {
      console.error('Failed to update request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, loading, createRequest, updateRequestStatus, refresh: fetchRequests };
}

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/sessions');
      setSessions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return { sessions, loading, refresh: fetchSessions };
}

export function useSupportRequests() {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/support-requests');
      setSupportRequests(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeSupportRequest = async (id: string) => {
    const response = await api.patch(`/support-requests/${id}`, { status: 'CLOSED' });
    await fetchSupportRequests();
    return response.data;
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  return { supportRequests, loading, refresh: fetchSupportRequests, closeSupportRequest };
}

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages');
      setMessages(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    const response = await api.post('/messages', { message });
    await fetchMessages();
    return response.data;
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return { messages, loading, sendMessage, refresh: fetchMessages };
}
