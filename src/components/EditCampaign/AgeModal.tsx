import React, { useEffect, useState } from "react";
import closeIcon from '../svg/close.svg';
import { baseURL } from "../URL";
import useFetch from "../Hooks/useFetch";
import { Backdrop, CircularProgress } from "@mui/material";

interface AgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAge: (age: string) => void;
}

const AgeModal: React.FC<AgeModalProps> = ({ isOpen, onClose , onSelectAge }) => { 
    const [ageRange, setAgeRange] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
    const url = `${baseURL}/CampaignTargetAudience/GetAll`;
    const onSuccess = () => {};
    const onError = () => {};
    const { data: apiData, refreshApi: refresh, error: Error, loading: loading } = useFetch(url, "GET", onSuccess, onError);
    const ageValues = apiData && apiData.length > 0 ? apiData[0].values : [];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectAgeRange = (age: string) => {
        setAgeRange(age);
        setIsDropdownOpen(false);
        onSelectAge(age);
        onClose();

    };

  
   


    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 transition-opacity flex items-start sm:items-start justify-center`}>
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}>
              <CircularProgress color="inherit" />
            </Backdrop>


            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className='flex justify-center p-4'>
                    <span
                        className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={onClose}
                    >
                        <img src={closeIcon} alt="Close" width={40} height={40} />
                    </span>
                </div>
                {/* <div className="relative bg-white rounded-lg shadow h-64"> */}
                    <div className="p-4 md:p-5">
                        <div className='flex justify-center mt-8 mb-3 mx-2'>
                            <div className='relative w-full flex justify-center'>
                                <div className="relative w-full">
                                    <button
                                        type="button"
                                        className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5 text-left"
                                        onClick={toggleDropdown}
                                    >
                                        {ageRange || "Select Age Range"}
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {ageValues.map((age: string, index: number) => (
                                                <li
                                                    key={index}
                                                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                                    onClick={() => selectAgeRange(age)}
                                                >
                                                    {age}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                {/* </div> */}
            </div>
        </div>
    );
};

export default AgeModal;
