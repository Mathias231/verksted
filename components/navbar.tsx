import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SignOutButton from './sessionButtons/signOut-button';
import SignInButton from './sessionButtons/signIn-button';
import Image from 'next/image';

function Navbar() {
  const { data: session } = useSession();

  return (
    <>
      <header className="bg-gray-800 py-4">
        <div className=" flex items-center w-full justify-between">
          <div className="flex items-center ml-4 gap-4">
            <Link
              href="/"
              className="bg-gray-700  hover:bg-gray-600 text-gray-300 hover:text-white text-xl font-medium py-2 px-4 rounded"
              title="Hjemmeside"
            >
              Hjem
            </Link>
          </div>
          <div className="flex items-center mr-4">
            <div className="mr-4">
              {session && (
                <Image
                  className="h-10 w-10 rounded-full"
                  src={session.user.image || ''}
                  alt="Profile Image"
                  width={100}
                  height={100}
                  priority={true}
                />
              )}
            </div>

            <div className="text-gray-300 mr-4">
              {session && (
                <p className="text-sm font-medium">{session.user.name}</p>
              )}
            </div>
            {session ? <SignOutButton /> : <SignInButton />}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
