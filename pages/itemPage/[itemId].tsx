import SingleItemPage from '@/components/items/singleItemPage';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

function ItemPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Gets itemId form query
  const { itemId } = router.query;
  if (typeof itemId !== 'string') return <div>Finner ikke gjenstand..</div>;

  if (!session?.user) return <div>Du må logge inn for å se denne siden...</div>;

  return (
    <div className="container mx-auto sm:p-4">
      <div className="max-w-xl mx-auto border p-2">
        <SingleItemPage itemId={itemId} />
      </div>
    </div>
  );
}

export default ItemPage;
