import { IItemWithComments } from '@/types/workshop.types';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = async <T>(url: string) => {
  let res = await axios.request<T>({
    url: url,
    method: 'get',
  });

  return res.data;
};

export default function GetItemWithComments(itemId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/item/comment/itemWithComment/${itemId}`,
    () =>
      fetcher<IItemWithComments>(`/api/item/comment/itemWithComment/${itemId}`),
  );

  return { item: data, error, isLoading, mutate };
}
