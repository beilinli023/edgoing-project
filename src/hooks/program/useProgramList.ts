import { useState, useEffect } from 'react';
import { Program } from '@/types/programTypes';
import { getAllPrograms } from '@/services/programs/programFileService';

export const useProgramList = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllPrograms();
        setPrograms(data);
      } catch (err) {
        console.error('获取项目列表失败:', err);
        setError(err instanceof Error ? err.message : '获取项目列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return { programs, loading, error };
};
