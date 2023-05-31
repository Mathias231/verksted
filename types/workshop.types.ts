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
  itemType: string;
  dateOfPurchuase: Date;
  storageLocation: string;
  imageId: string;
  dateCreated: Date;
  dateUpdated: string;
}
