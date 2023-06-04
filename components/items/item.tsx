import GetItems from '@/lib/hooks/getItems';
import { IItem } from '@/types/workshop.types';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaComment, FaPen, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Item(item: IItem) {
  const { data: session } = useSession();
  const { mutate } = GetItems();

  const handleDelete = async (itemId: string) => {
    const deleteItem = axios.delete(`/api/item/${itemId}`).catch((err) => {
      toast.warn(err);
    });

    toast.success('Gjenstand Slettet!');
    return mutate();
  };

  const handleUpdate = async (itemId: string) => {};

  return (
    <div className="bg-lime-200 border rounded-md p-2">
      <div className="p-1">
        <h1>{item.name}</h1>
      </div>

      <div className="bg-white flex justify-center border rounded-md">
        <Image
          src={`/api/image/${item.image.internalName}`}
          alt=""
          height={256}
          width={256}
        />
      </div>

      <div className="p-1">
        <p>Plassering: {item.storageLocation}</p>
        <p>Type: {item.itemType}</p>
      </div>

      <div className="flex space-x-3 p-1">
        <Link href={`/itemPage/${item.id}`}>
          <FaComment className="hover:text-green-500" />
        </Link>
        {session?.user.role === 'ADMIN' && (
          <>
            <button onClick={() => handleUpdate(item.id)}>
              <FaPen className="hover:text-blue-600" />
            </button>
            <button onClick={() => handleDelete(item.id)}>
              <FaTrash className="hover:text-red-600" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Item;