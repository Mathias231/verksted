import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FaPhotoVideo } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import axios from 'axios';

function CreateItem() {
  const { data: session } = useSession();
  const [category, setCategory] = useState('Verktoy');
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [dateOfPurchase, setDateOfPurchase] = useState(new Date());
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!image) {
      return setPreview(null);
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  if (session?.user.role !== 'ADMIN') return <p>Ingen Tilgang</p>;

  // Image handling
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Select File
    const file = e.target.files ? e.target.files[0] : null;

    // Checks if is not selecter or if the file size is bigger than 10MB
    if (!file) return toast.error('No file selected');

    if (file.size / 1024 / 1024 > 10) return toast.error('File size too big');

    setImage(file);
  };

  // Submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sets Loading to true
    setLoading(true);
    if (!image) {
      setImage(null);
      setLoading(false);
      return toast.error('No image selected');
    }

    // Sending image Path, Name and ID to db and returns imageId
    const formData = new FormData();
    formData.append('image', image);
    const uploadImage = await axios.post('/api/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Returns imageId
    const { imageId } = uploadImage.data;

    // Uploading Item to db
    const createItem = await axios
      .post('/api/item/', {
        category: category.toUpperCase(),
        name: name,
        imageId: imageId,
        dateOfPurchase: dateOfPurchase,
        itemType: type,
        storageLocation: location,
      })
      .catch((err) => {
        toast.warn(err, {
          position: 'top-center',
        });
      });

    // Reset the form fields
    setCategory('Verktoy');
    setName('');
    setImage(null);
    setDateOfPurchase(new Date());
    setLocation('');
    setType('');
    setLoading(false);

    // Success
    toast.success('Gjenstand er blitt lagt til!');
  };

  return (
    <form onSubmit={handleSubmit} className="sm:flex sm:justify-center">
      <div className="space-y-12 sm:border rounded-lg sm:m-14 sm:max-w-5xl max-w-full">
        <div className="sm:border-2 border-none sm:border-gray-900/10 pb-12 p-5">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Legg til nytt verktøy eller utstyr
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Velg kategori
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  value={category}
                  required
                  onChange={(e) => setCategory(e.target.value)}
                  name="category"
                  autoComplete="category"
                  className="block w-full pl-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option>Verktøy</option>
                  <option>Utstyr</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Navn
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                  <input
                    type="text"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    id="itemName"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Navn på gjenstand"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Last opp bilde
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {preview ? (
                      <Image
                        src={preview}
                        alt=""
                        width={1200}
                        height={1200}
                        className="w-52 "
                      />
                    ) : (
                      <FaPhotoVideo
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    )}
                  </label>
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Last opp bilde</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">Eller dra og slipp</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPEG opp til 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Kjøpsdato
              </label>
              <div className="mt-2">
                <DatePicker
                  className="border-2 p-1 pl-2 w-full rounded-md hover:cursor-pointer focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  selected={dateOfPurchase}
                  onChange={(date) => date && setDateOfPurchase(date)}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-6">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Type
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="itemType"
                  value={type}
                  required
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Borhammer, skrutrekker.."
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-6 sm:col-start-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Plassering
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="itemLocation"
                  value={location}
                  required
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="flex items-center gap-x-6">
              <button
                type="submit"
                className={`rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 ${
                  loading && 'hover:cursor-progress'
                }`}
                disabled={loading}
              >
                Last opp
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreateItem;
