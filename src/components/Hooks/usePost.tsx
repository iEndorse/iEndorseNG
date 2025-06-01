import { useState } from 'react';

interface UsePostResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  postData: (body: any) => Promise<void>;
}

const usePost = <T, >(url: string): UsePostResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const postData = async (body: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: T = await response.json();
      setData(responseData);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
};

export default usePost;
