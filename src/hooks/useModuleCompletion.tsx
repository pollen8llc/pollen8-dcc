import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';

export interface ModuleCompletionStatus {
  rel8_complete: boolean | null;
  eco8_complete: boolean | null;
  modul8_complete: boolean | null;
  labr8_complete: boolean | null;
  loading: boolean;
  error: Error | null;
}

export const useModuleCompletion = () => {
  const { session } = useSession();
  const [status, setStatus] = useState<ModuleCompletionStatus>({
    rel8_complete: null,
    eco8_complete: null,
    modul8_complete: null,
    labr8_complete: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!session?.user?.id) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchCompletionStatus = async () => {
      try {
        setStatus(prev => ({ ...prev, loading: true, error: null }));
        
        const { data, error } = await supabase
          .from('profiles')
          .select('rel8_complete, eco8_complete, modul8_complete, labr8_complete')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        setStatus({
          rel8_complete: data?.rel8_complete ?? false,
          eco8_complete: data?.eco8_complete ?? false,
          modul8_complete: data?.modul8_complete ?? false,
          labr8_complete: data?.labr8_complete ?? false,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching module completion status:', error);
        setStatus(prev => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
      }
    };

    fetchCompletionStatus();
  }, [session?.user?.id]);

  const updateModuleCompletion = async (module: 'rel8' | 'eco8' | 'modul8' | 'labr8', completed: boolean) => {
    if (!session?.user?.id) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [`${module}_complete`]: completed })
        .eq('id', session.user.id);

      if (error) throw error;

      setStatus(prev => ({
        ...prev,
        [`${module}_complete`]: completed,
      }));

      return true;
    } catch (error) {
      console.error(`Error updating ${module} completion status:`, error);
      return false;
    }
  };

  return {
    ...status,
    updateModuleCompletion,
  };
};