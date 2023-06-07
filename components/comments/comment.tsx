import { IComment, IItemWithComments } from '@/types/workshop.types';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';

interface CommentProps {
  comment: IComment;
  mutate: KeyedMutator<IItemWithComments>;
}

function Comment({ comment, mutate }: CommentProps) {
  const { data: session } = useSession();

  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const deleteComment = axios
      .delete(`/api/comment/${comment.id}`)
      .catch((err) => {
        toast.warn(err);
      });

    toast.success('Kommentar er slettet!');
    return mutate();
  };

  return (
    <div className="border p-2 rounded-lg">
      <div className="flex">
        <Image
          src={comment.user.image}
          alt=""
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="p-2">{comment.user.name}</h1>
      </div>
      <div className="p-3">{comment.content}</div>
      <span>{comment.dateCreated}</span>
      {session?.user.userId === comment.user.id ||
      session?.user.role === 'ADMIN' ? (
        <div className="flex space-x-2">
          <div className="mt-2">
            <button onClick={handleDelete}>
              <FaTrash className="hover:text-red-600" />
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default Comment;
