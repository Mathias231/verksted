import { IItem } from '@/types/workshop.types';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { useState, useEffect } from 'react';
import { ItemResponse } from '@/types/swr.types';

const fetcher = async <T>(url: string) => {
  let res = await axios.request<T>({
    url: url,
    method: 'get',
  });

  return res.data;
};

export default function GetItems() {
  const [pageOffset, setPageOffset] = useState(0); // The amount of items to skip in db
  const [pageLength, setPageLength] = useState(5); // The amont of items to take from db

  const { data, error, isLoading, mutate } = useSWR(`/api/item/`, () =>
    fetcher<ItemResponse>(`/api/item?take=${pageLength}&skip=${pageOffset}`),
  );

  // Next Page
  const nextPage = () => {
    setPageOffset(pageOffset + pageLength);
  };

  // Previous Page
  const prevPage = () => {
    setPageOffset(pageOffset - pageLength);
  };

  // Update once pageOffset & pageLength is changed
  useEffect(() => {
    mutate();
  }, [pageOffset, pageLength, mutate]);

  // Return data
  return {
    items: data?.item,
    count: data?.totalAmount,
    error,
    isLoading,
    pageLength,
    pageOffset,
    nextPage,
    prevPage,
    mutate,
  };
}
