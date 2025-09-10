import React, { useContext, useState } from 'react';
// 1. FIXED THE IMPORT: Import the context object, not the provider, and fix the path
import { userDataContext } from '../Context/userContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";

function Customize2() {
    // This will now work correctly
    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext);
    
    // 2. FIXED THE BUG: Corrected the property name to 'assistantName'
    const [assistantName, setAssistantName] = useState(userData?.user?.assistantName || "");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdateAssistantName = async () => {
        setLoading(true);
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);
            if (backendImage) {
                formData.append("assistantImage", backendImage);
            } else {
                formData.append("imageUrl", selectedImage);
            }

            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true });
            
            // 3. FIXED THE REDUNDANT CODE: Removed the extra setUserData call
            setUserData(result.data);
            
            setLoading(false);
            navigate("/");
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#035761] flex justify-center items-center flex-col p-[20px] relative'>
            <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={() => navigate("/customize")} />
            <h1 className='text-white text-[30px] mb-[40px] text-center'> Create Your <span className='text-blue-400'>Assistant Name</span> </h1>
            
            <input 
                type="text" // Corrected type from "type" to "text"
                placeholder='e.g., Sifra' 
                className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
                required 
                onChange={(e) => setAssistantName(e.target.value)} 
                value={assistantName} 
            />

            {assistantName && (
                <button 
                    className='mt-[30px] min-w-[300px] h-[60px] bg-white text-blue-600 rounded-full text-[18px] font-semibold hover:bg-blue-600 hover:text-white transition duration-300'
                    disabled={loading}
                    onClick={handleUpdateAssistantName}
                >
                    {!loading ? "Finish Customization" : "Loading..."}
                </button>
            )}
        </div>
    );
}

export default Customize2;