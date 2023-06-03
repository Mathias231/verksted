export interface IWorkshop {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  items: IItem[];
}

export interface IItem {
  id: string;
  userId: string;
  category: string;
  name: string;
  itemType: string;
  dateOfPurchuase: Date;
  storageLocation: string;
  image: {
    internalName: string;
  };
  dateCreated: Date;
  dateUpdated: string;
}
