import React from "react";

const Navbar = ({ walletAddress, parseWalletKey }) => {
  return (
      <nav className="bg-gray-900 dark:bg-gray-900 fixed w-full z-20 top-0 left-0">
        <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center">
            <img
                src="../Assets/cat-logo.png"
                className="h-8 mr-3"
                alt="Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            CatHub
          </span>
          </a>
          <div className="flex md:order-2 mx-2 space-x-2">
            <button
                type="button"
                className="text-white bg-purple-700 hover-bg-blue-800 focus-ring-4 focus-outline-none focus-ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark-bg-blue-600 dark-hover-bg-blue-700 dark-focus-ring-blue-800"
            >
              {<p>asd</p>}
              Initialize
            </button>
            <button
                type="button"
                className="text-white bg-blue-700 hover-bg-blue-800 focus-ring-4 focus-outline-none focus-ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark-bg-blue-600 dark-hover-bg-blue-700 dark-focus-ring-blue-800"
            >
              {parseWalletKey(walletAddress)}
            </button>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
