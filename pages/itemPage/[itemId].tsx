import SingleItemPage from '@/components/items/singleItemPage';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

function ItemPage() {
  const router = useRouter();

  // Gets itemId form query
  const { itemId } = router.query;
  if (typeof itemId !== 'string') return <div>Finner ikke gjenstand..</div>;

  return (
    <div className="container mx-auto sm:p-4">
      <div className="max-w-xl mx-auto border p-2">
        <SingleItemPage itemId={itemId} />
      </div>
    </div>
  );
}

export default ItemPage;
