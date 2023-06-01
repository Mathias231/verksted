import { IItem } from '@/types/workshop.types';
import React, { useState } from 'react';

function Item(item: IItem) {
  return <div>{item.itemType}</div>;
}

export default Item;
