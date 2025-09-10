import React, { useContext } from 'react';
// 1. FIXED THE IMPORT: Import the context object, not the provider, and fix the path
import { userDataContext } from '../Context/userContext.jsx';

function Card({ image }) {
    // This will now work correctly
    const {
        setFrontendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage
    } = useContext(userDataContext);

    return (
        <div
            className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0a0af47e] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage === image ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
            onClick={() => {
                setSelectedImage(image);
                setBackendImage(null);
                setFrontendImage(null);
            }}
        >
            <img src={image} className='w-full h-full object-cover' alt="Assistant Choice" />
        </div>
    );
}

export default Card;