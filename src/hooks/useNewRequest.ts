import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import api from '@/lib/axios';

export type ServiceType =
  | 'Private Home Showing'
  | 'Multi-Home Tour'
  | 'Request a Task'
  | 'Virtual Walkthrough'
  | 'Buyer Consultation'
  | 'Flat Fee Agent'
  | 'Market Analysis (CMA)'
  | 'Listing Consultation'
  | 'Open House Hosting'
  | 'Property Photography'
  | 'Move-In / Move-Out Cleaning'
  | 'Home Staging'
  | 'Inspection Coordination'
  | 'Lockbox Access Support';

export interface RequestFormData {
  address: string;
  city: string;
  state: string;
  zip: string;
  mlsNumber: string;
  clientName: string;
  clientPhone: string;
  accessNotes: string;
  lockboxCode: string;
  additionalNotes: string;
  date: string;
  startTime: string;
  endTime: string;
}

export function useNewRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRequest = async (serviceType: ServiceType, compensation: number, formData: RequestFormData) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const submissionData = {
        ...formData,
        serviceType,
        compensation: compensation.toString(),
        clientId: user.id,
      };

      const response = await api.post('/requests', submissionData);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Something went wrong';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { submitRequest, loading, error };
}
