import { IComment, IItemWithComments } from '@/types/workshop.types';
import axios from 'axios';
import Image from 'next/image';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';

interface CommentProps {
  comment: IComment;
  mutate: KeyedMutator<IItemWithComments>;
}

function Comment({ comment, mutate }: CommentProps) {
  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    // Not working yet | Zod Error at /api/item/comment/[id]
    const deleteComment = axios
      .delete(`/api/item/comment/${comment.id}`)
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
      <div className="mt-2">
        <button onClick={handleDelete}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default Comment;
