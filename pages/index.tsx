import Item from '@/components/paginationItem/item';
import GetItems from '@/lib/getItems';
import GetWorkshopWithItems from '@/lib/getWorkshopWithItems';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

export default function Home() {
  const { items, error, isLoading, nextPage, prevPage, mutate } = GetItems();
  const { data: session } = useSession();
  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Laster data...</div>;
  if (!items) return <div>Laster data...</div>;

  return (
    <div>
      {session?.user.role === 'ADMIN' && (
        <div className="flex justify-center mt-3">
          <Link href="/createItem/" title="Legg til verktøy">
            <FaPlus size={40} className="hover:animate-spin" />
          </Link>
        </div>
      )}

      {/* {items.map((item) => {
        return <Item key={item.id} {...item} />;
      })}

      <button
        className="bg-gray-400 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg mt-4"
        onClick={prevPage}
      >
        Tilbake
      </button>

      <div>----------</div>

      <button
        className="bg-gray-400 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 ml-4"
        onClick={nextPage}
      >
        Neste
      </button> */}
    </div>
  );
}
