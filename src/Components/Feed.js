import React, { useState } from "react";
import {useSelector} from "react-redux";
import {MdBookmarks} from "react-icons/md";

const GalleryItem = ({ gif }) => {
    const [isHovered, setIsHovered] = useState(false);

    const user = useSelector((state) => state.user);
    const handleHover = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className="relative cursor-pointer"
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
        >
            <div className="w-full h-full">
                <img
                    src={gif.gifLink}
                    alt=""
                    className="w-full h-full object-cover"
                />
            </div>

            {isHovered && (
                <>
                <div className="absolute inset-x-0 top-0 px-3 py-2 flex items-center">
                    <MdBookmarks className="text-lg text-white" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
                    <div className="text-white text-center">
                        <p className="text-xl font-bold">GIF Information</p>
                        <p className={"text"}>{`User: ${gif.userAddress}`}</p>
                    </div>
                </div>
                </>)
            }

        </div>
    );
};

export default GalleryItem;
