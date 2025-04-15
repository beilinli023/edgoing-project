import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Program } from '@/types/programTypes';
import { getProgram } from '@/services/programs/programFileService';

export const useProgramDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('No program ID provided');
        }

        const data = await getProgram(id);
        if (!data) {
          throw new Error('Program not found');
        }

        setProgram(data);
      } catch (err) {
        console.error('Error fetching program:', err);
        setError(err instanceof Error ? err.message : 'Failed to load program');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  return { id, program, loading, error };
};
