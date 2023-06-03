import Item from '@/components/paginationItem/item';
import GetItems from '@/lib/getItems';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

export default function Home() {
  const {
    items,
    count,
    error,
    isLoading,
    pageLength,
    pageOffset,
    nextPage,
    prevPage,
    mutate,
  } = GetItems();
  const { data: session } = useSession();

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Laster data...</div>;
  if (!items || !count)
    return (
      <div>
        {session?.user.role === 'ADMIN' && (
          <div className="flex justify-center mt-3">
            <Link href="/createItem/" title="Legg til verktøy">
              <FaPlus size={40} className="hover:animate-spin" />
            </Link>
          </div>
        )}
        Laster data...
      </div>
    );

  const currentPage = Math.floor(pageOffset / pageLength) + 1;
  const totalPageCount = Math.ceil(count / pageLength);
  return (
    <div>
      {session?.user.role === 'ADMIN' && (
        <div className="flex justify-center mt-3">
          <Link href="/createItem/" title="Legg til verktøy">
            <FaPlus size={40} className="hover:animate-spin" />
          </Link>
        </div>
      )}
      <div className="border m-5 p-5 rounded-md grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {items.map((item) => {
          return <Item key={item.id} {...item} />;
        })}
      </div>
      {pageOffset - pageLength >= 0 && (
        <button
          className="bg-gray-400 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg mt-4"
          onClick={prevPage}
        >
          Tilbake
        </button>
      )}
      {currentPage} / {totalPageCount}
      {pageOffset + pageLength < count && (
        <button
          className="bg-gray-400 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 ml-4"
          onClick={nextPage}
        >
          Neste
        </button>
      )}
    </div>
  );
}
