import { IItem } from '@/types/workshop.types';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { useState } from 'react';

const fetcher = async <T>(url: string) => {
  let res = await axios.request<T>({
    url: url,
    method: 'get',
  });

  return res.data;
};

export default function GetItems() {
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLength, setPageLength] = useState(5);

  const { data, error, isLoading, mutate } = useSWR(`/api/item/`, () =>
    fetcher<IItem[]>(`/api/item?take=${pageLength}&skip=${pageOffset}`),
  );

  console.log('pageOffset:', pageOffset);
  const nextPage = () => {
    setPageOffset(pageOffset + pageLength);
    mutate();
  };

  const prevPage = () => {
    setPageOffset(pageOffset - pageLength);
    mutate();
  };

  return {
    items: data,
    error,
    isLoading,
    nextPage,
    prevPage,
    mutate,
  };
}
