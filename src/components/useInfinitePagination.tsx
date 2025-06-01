import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseInfinitePaginationProps {
  url: string;
  pageNumber: number;
  pageSize: number;
}

const useInfinitePagination = <T,>({
  url,
  pageNumber,
  pageSize,
}: UseInfinitePaginationProps) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error state on new fetch
      try {
        const token =  window.localStorage.getItem('token'); // Replace with the actual token or retrieve it dynamically
        const response = await axios.post(
          url,
          {}, // Request body if needed, currently empty
          {
            params: {
              PageNumber: pageNumber,
              PageSize: pageSize,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal, // Allow aborting
          }
        );
    
        const newData = Array.isArray(response.data?.data) ? response.data.data : [];
        setData(prevData =>
          pageNumber === 1 ? newData : [...prevData, ...newData]
        );
        setHasMore(newData.length === pageSize);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();

    return () => {
      controller.abort(); // Cancel previous request on dependency change
    };
  }, [url, pageNumber, pageSize]);

  return { data, loading, error, hasMore };
};

export default useInfinitePagination;
