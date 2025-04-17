
import { useState, useEffect } from 'react';
import { runConnectionTest } from '@/utils/supabaseDebugger';

export type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';

export const useSupabaseConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      setConnectionStatus('testing');
      try {
        const result = await runConnectionTest();
        setConnectionStatus(result.success ? 'success' : 'error');
        if (!result.success) {
          setConnectionError(`Supabase connection failed: ${result.error}`);
        } else {
          setConnectionError(null);
        }
      } catch (err) {
        setConnectionStatus('error');
        setConnectionError('Connection test failed with unexpected error');
      }
    };
    
    testConnection();
  }, []);

  return { connectionStatus, connectionError };
};
