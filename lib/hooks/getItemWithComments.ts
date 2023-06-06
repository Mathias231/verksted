import { IItemWithComments } from '@/types/workshop.types';
import axios from 'axios';
import useSWR from 'swr';
import { useEffect } from 'react';

const fetcher = async <T>(url: string) => {
  let res = await axios.request<T>({
    url: url,
    method: 'get',
  });

  return res.data;
};

export default function GetItemWithComments(itemId: string) {
  const { data, error, isLoading, mutate } = useSWR(`/api/item/${itemId}`, () =>
    fetcher<IItemWithComments>(`/api/item/${itemId}`),
  );

  // Update data with new data once itemId is passed
  useEffect(() => {
    mutate();
  }, [itemId, mutate]);

  return { item: data, error, isLoading, mutate };
}
