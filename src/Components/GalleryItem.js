import React, { useState } from "react";
import { MdDelete } from "react-icons/md";

const GalleryItem = ({ gif, walletaddress, action }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleHover = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const onClickDelete = () => {
        if (window.confirm("Are you sure you want to delete this GIF?")) {
            // Call the deleteGif function with the GIF's ID or any other identifier you use
            action(gif.gifLink); // Pass the GIF's ID to the deleteGif function
        }
    };

    return (
        <div
            className="relative cursor-pointer"
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
        >
            <div className="w-full h-full">
                <img src={gif.gifLink} alt="" className="w-full h-full object-cover" />

                {isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
                        <div className="text-white text-center">
                            <p className="text-xl font-bold">GIF Information</p>
                            <p>{`User: ${gif.userAddress}`}</p>

                            {/* Add more information here */}
                        </div>
                    </div>
                )}

                {gif?.userAddress == walletaddress && (
                    <div className="absolute top-2 right-2 z-20 w-6 h-6 cursor-pointer rounded-full bg-[rgba(256,256,256,0.6)] flex items-center justify-center hover:bg-white"
                    >
                        {console.log("Hovering to: ", gif.gifLink)}
                        <MdDelete onClick={onClickDelete} className="text-lg text-red-500" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryItem;
