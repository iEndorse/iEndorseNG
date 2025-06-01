import React, { useState } from "react";
import closeIcon from '../svg/close.svg';
import { baseURL } from "../URL";
import useFetch from "../Hooks/useFetch";
import { Backdrop, CircularProgress } from "@mui/material";

interface OccipationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectOccupation: (occupation: string) => void;
}

const OccupationModal: React.FC<OccipationModalProps> = ({ isOpen, onClose, onSelectOccupation }) => {
    const [occupation, setOccupation] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
    const url = `${baseURL}/CampaignTargetAudience/GetAll`;
    const onSuccess = () => {};
    const onError = () => {};
    const { data: apiData, refreshApi: refresh, error: Error, loading: loading } = useFetch(url, "GET", onSuccess, onError);
    const occupations = apiData && apiData.length > 0 ? apiData[1].values : [];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectOccupation = (occupation: string) => {
        setOccupation(occupation);
        setIsDropdownOpen(false);
        onSelectOccupation(occupation);
        onClose();
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredOccupations = occupations.filter((occupation: string) =>
        occupation.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <div className="relative bg-white rounded-lg shadow overflow-hidden pb-40">
                    <div className="p-4 md:p-5">
                        <div className='flex justify-center mt-8 mb-3 mx-2'>
                            <div className='relative w-full flex justify-center'>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        placeholder="Search Occupation..."
                                        className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5 mb-2"
                                    />
                                    <button
                                        type="button"
                                        className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5 text-left"
                                        onClick={toggleDropdown}
                                    >
                                        {occupation || "Select Occupation"}
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto ">
                                            {filteredOccupations.length > 0 ? (
                                                filteredOccupations.map((occupation: string, index: number) => (
                                                    <li
                                                        key={index}
                                                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                                        onClick={() => selectOccupation(occupation)}
                                                    >
                                                        {occupation}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="px-4 py-2 text-gray-500">
                                                    No occupations found
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OccupationModal;
