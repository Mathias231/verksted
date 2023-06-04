import GetItemWithComments from '@/lib/hooks/getItemWithComments';
import React, { useState, FormEvent } from 'react';
import Comment from '../comments/comment';
import Image from 'next/image';
import axios from 'axios';

interface PageProps {
  itemId: string;
}

function SingleItemPage({ itemId }: PageProps) {
  const { item, error, isLoading, mutate } = GetItemWithComments(itemId);
  const [content, setContent] = useState('');

  if (isLoading) return <div>Laster inn...</div>;
  if (!item) return <div>Gjenstand eksisterer ikke</div>;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const postComment = await axios.post('/api/item/comment/', {
      itemId: itemId,
      content: content,
    });

    setContent('');
    return mutate();
  };

  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
      <Image
        src={`/api/image/${item.image.internalName}`}
        alt=""
        width={900}
        height={900}
        priority
        className="w-full rounded-lg mb-4 border"
      />
      <div className="grid justify-between text-gray-500 sm:col-span-2">
        <span className="text-sm">Kategori: {item.category}</span>
        <span className="text-sm">Plassering: {item.storageLocation}</span>
        <span className="text-sm">Type: {item.itemType}</span>
        <span className="text-sm">Kjøpt: {item.dateOfPurchase}</span>
      </div>
      <div>
        <h1>Kommentarer</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            className="border w-full p-1 rounded-md"
            required
            value={content}
            placeholder="Skriv en kommentar..."
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          <button
            type="submit"
            className="bg-blue-500 p-2 border rounded-md text-white hover:bg-blue-600"
          >
            Legg til
          </button>
        </form>
      </div>
      <div className="space-y-5">
        {item.comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} mutate={mutate} />;
        })}
      </div>
    </div>
  );
}

export default SingleItemPage;
