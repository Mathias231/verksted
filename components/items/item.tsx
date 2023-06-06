import GetItems from '@/lib/hooks/getItems';
import { ItemResponse } from '@/types/swr.types';
import { IItem, IItemWithComments } from '@/types/workshop.types';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaComment, FaPen, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';

interface ItemProps {
  item: IItem;
  mutate: KeyedMutator<ItemResponse>;
}

function Item({ item, mutate }: ItemProps) {
  const { data: session } = useSession();

  const handleDelete = async (itemId: string) => {
    const deleteItem = axios.delete(`/api/item/${itemId}`).catch((err) => {
      toast.warn(err);
    });

    toast.success('Gjenstand Slettet!');
    return mutate();
  };

  return (
    <div className="bg-lime-200 border rounded-md p-2">
      <div className="p-1">
        <h1>{item.name}</h1>
      </div>

      <div className="bg-white flex justify-center border rounded-md">
        <Image
          src={`/api/image/${item.image.internalName}`}
          alt=""
          priority
          height={256}
          width={256}
        />
      </div>

      <div className="p-1">
        <p>Kategori: {item.category}</p>
        <p>Plassering: {item.storageLocation}</p>
        <p>Type: {item.itemType}</p>
        <p>Dato Kjøpt: {item.dateOfPurchase}</p>
      </div>

      {session?.user && (
        <div className="flex space-x-3 p-1">
          <Link href={`/itemPage/${item.id}`}>
            <FaComment className="hover:text-green-500" />
          </Link>
          {session?.user.role === 'ADMIN' && (
            <>
              {/* <button onClick={() => handleUpdate(item.id)}>
                <FaPen className="hover:text-blue-600" />
              </button> */}
              <button onClick={() => handleDelete(item.id)}>
                <FaTrash className="hover:text-red-600" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Item;
