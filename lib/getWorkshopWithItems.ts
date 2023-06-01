import { IWorkshop } from '@/types/workshop.types';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = async <T>(url: string) => {
  let res = await axios.request<T>({
    url: url,
    method: 'get',
  });

  return res.data;
};

export default function GetWorkshopWithItems() {
  const { data, error, isLoading, mutate } = useSWR(`/api/workshop/`, () =>
    fetcher<IWorkshop>('/api/workshop/'),
  );

  return { workshop: data, error, isLoading, mutate };
}
