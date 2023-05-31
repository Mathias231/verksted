import GetWorkshopWithItems from '@/lib/getWorkshopWithItems';

export default function Home() {
  const { workshop, error, isLoading, mutate } = GetWorkshopWithItems();

  if (!workshop) return <div>Verkstedet er tomt...</div>;

  return <div></div>;
}
