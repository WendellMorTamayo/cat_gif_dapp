import React from "react";
import GalleryItem from "./GalleryItem";

const GifList = ({ gifList, walletaddress, action }) => {

    return (
        <div className="columns-4 gap-3 w-3/4 mx-auto space-y-1 pb-28">
            {gifList.map((item, index) => (
                <GalleryItem key={index} gif={item} walletaddress={walletaddress} action={action} />
            ))}
        </div>
    );
};

export default GifList;
