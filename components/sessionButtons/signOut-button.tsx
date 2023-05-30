import { signOut } from 'next-auth/react';
import React from 'react';

function SignOutButton() {
  return (
    <div>
      <button
        onClick={() => signOut()}
        className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded"
        title="Logg Ut"
      >
        Logg Ut
      </button>
    </div>
  );
}

export default SignOutButton;
