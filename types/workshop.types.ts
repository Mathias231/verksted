export interface IWorkshop {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  items: IItem[];
}

export interface IItem {
  id: string;
  userId: string;
  category: string;
  name: string;
  itemType: string;
  dateOfPurchuase: string;
  storageLocation: string;
  image: {
    internalName: string;
  };
  dateCreated: string;
  dateUpdated: string;
}

export interface IItemWithComments {
  name: string;
  category: string;
  storageLocation: string;
  itemType: string;
  dateOfPurchase: string;
  image: {
    internalName: string;
  };
  comments: IComment[];
  dateCreated: string;
  dateUpdated: string;
}

export interface IComment {
  id: string;
  content: string;
  dateCreated: string;
  dateUpdated: string;
  user: {
    name: string;
    image: string;
  };
}
