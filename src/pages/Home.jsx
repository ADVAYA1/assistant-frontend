import React, { useContext, useEffect, useRef, useState } from 'react';
// 1. FIXED THE IMPORT: Import the context object, not the provider, and fix the path
import { userDataContext } from '../Context/userContext.jsx'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiMenuAltRight } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import ParticlesBackground from "../components/ParticlesBackground.jsx";

function Home() {
    // This will now work correctly with the fixed import
    const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
    
    const navigate = useNavigate();
    const [listening, setListening] = useState(false);
    const [userText, setUserText] = useState("");
    const [aiText, setAiText] = useState("");
    const isSpeakingRef = useRef(false);
    const recognitionRef = useRef(null);
    const [ham, setHam] = useState(false);
    const isRecognizingRef = useRef(false);
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
            setUserData(null);
            navigate("/signin");
        } catch (error) {
            setUserData(null);
            console.log("Logout error:", error);
        }
    };

    const startRecognition = () => {
        if (!isSpeakingRef.current && !isRecognizingRef.current) {
            try {
                recognitionRef.current?.start();
            } catch (error) {
                if (error.name !== "InvalidStateError") {
                    console.error("Start error: ", error);
                }
            }
        }
    };

    const speak = (text) => {
        if (!synth) return;
        const utterence = new SpeechSynthesisUtterance(text);
        utterence.lang = 'hi-IN';
        const voices = synth.getVoices();
        const hindiVoice = voices.find(v => v.lang === 'hi-IN');
        if (hindiVoice) {
            utterence.voice = hindiVoice;
        }

        isSpeakingRef.current = true;
        utterence.onend = () => {
            setAiText("");
            isSpeakingRef.current = false;
            setTimeout(startRecognition, 800);
        };
        synth.cancel();
        synth.speak(utterence);
    };

    const handleCommand = (data) => {
        const { type, userInput, response } = data;
        speak(response);

        const actions = {
            'google-search': () => window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank'),
            'calculator-open': () => window.open(`https://www.google.com/search?q=calculator`, '_blank'),
            'instagram-open': () => window.open(`https://www.instagram.com/`, '_blank'),
            'facebook-open': () => window.open(`https://www.facebook.com/`, '_blank'),
            'weather-show': () => window.open(`https://www.google.com/search?q=weather`, '_blank'),
            'youtube-search': () => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank'),
            'youtube-play': () => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank'),
        };

        if (actions[type]) {
            actions[type]();
        }
    };

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setAiText("Speech recognition unsupported. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognitionRef.current = recognition;

        let isMounted = true;

        const restartRecognition = () => {
            if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
                try {
                    recognition.start();
                } catch (e) {
                    if (e.name !== "InvalidStateError") console.error(e);
                }
            }
        };

        recognition.onstart = () => {
            isRecognizingRef.current = true;
            setListening(true);
        };

        recognition.onend = () => {
            isRecognizingRef.current = false;
            setListening(false);
            setTimeout(restartRecognition, 500);
        };

        recognition.onerror = (event) => {
            console.warn("Recognition error: ", event.error);
            isRecognizingRef.current = false;
            setListening(false);
        };

        recognition.onresult = async (e) => {
            const transcript = e.results[e.results.length - 1][0].transcript.trim();
            if (transcript.toLowerCase().includes(userData?.user?.assistantName.toLowerCase())) {
                setUserText(transcript);
                recognition.stop();
                const data = await getGeminiResponse(transcript);
                if (data) {
                    handleCommand(data);
                    setAiText(data.response);
                }
                setUserText("");
            }
        };

        try {
            const greeting = new SpeechSynthesisUtterance(`Namaste ${userData?.user?.name}, main aapki sahayata ke liye taiyaar hoon.`);
            greeting.lang = 'hi-IN';
            synth?.speak(greeting);
        } catch (e) {
             // ignore speech errors
        }
        
        const startTimeout = setTimeout(restartRecognition, 1000);

        return () => {
            isMounted = false;
            clearTimeout(startTimeout);
            recognition.stop();
            synth?.cancel();
        };
    }, [userData]); // Added userData dependency

    return (
        <div className='w-full h-[100vh] relative flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
            <ParticlesBackground variant="home" />
            <BiMenuAltRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={() => setHam(true)} />
            
            {/* Mobile Hamburger Menu */}
            <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform z-20`}>
                <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={() => setHam(false)} />
                <button className='w-full h-[50px] bg-white text-blue-600 rounded-lg text-md font-semibold' onClick={handleLogout} >Logout</button>
                <button className='w-full h-[50px] bg-white text-blue-600 rounded-lg text-md font-semibold' onClick={() => navigate("/customize")} >Customize Assistant</button>
                <div className='w-full h-[2px] bg-gray-400'></div>
                <h1 className='text-white font-semibold text-[19px]'>History</h1>
                <div className='w-full flex-1 gap-[10px] overflow-y-auto flex flex-col'>
                    {userData?.user?.history?.map((his, index) => (
                        // 2. FIXED TYPO: text-[180px] was changed to text-[18px]
                        <span key={index} className='text-gray-200 text-[18px] truncate'>{his}</span>
                    ))}
                </div>
            </div>

            {/* Desktop Buttons */}
            <button className='absolute hidden lg:block top-4 right-5 h-[50px] px-6 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition' onClick={handleLogout}>Logout</button>
            <button className='absolute hidden lg:block top-4 left-5 h-[50px] px-6 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition' onClick={() => navigate("/customize")}>Customize Assistant</button>

            {/* Main Content */}
            <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-2xl shadow-lg'>
                <img src={userData?.user?.assistantImage} alt="Assistant" className='h-full w-full object-cover' />
            </div>
            <h1 className='text-white text-[18px] font-semibold mt-4'>I'm {userData?.user?.assistantName}</h1>
            
            <div className='w-[200px] h-[100px] my-2'>
                {!aiText && <img src={userImg} alt="Listening..." className='w-full h-full object-contain' />}
                {aiText && <img src={aiImg} alt="Speaking..." className='w-full h-full object-contain' />}
            </div>
            
            <h1 className='text-white text-lg font-semibold text-center w-full max-w-md h-12'>{userText || aiText || "..."}</h1>
        </div>
    );
}

export default Home;