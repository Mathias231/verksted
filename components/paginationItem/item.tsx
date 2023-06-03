import GetItems from '@/lib/getItems';
import { IItem } from '@/types/workshop.types';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
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
      {session?.user.role === 'ADMIN' && (
        <div>
          <button onClick={() => handleDelete(item.id)}>
            <FaTrash className="hover:text-red-600" />
          </button>
          {/* <button onClick={() => handleUpdate(item.id)}>
            <FaPen className="hover:text-blue-600" />
          </button> */}
        </div>
      )}
    </div>
  );
}

export default Item;
