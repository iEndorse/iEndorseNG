import React, { useState, useEffect } from "react";
import closeIcon from '../../svg/close.svg';
import searchIcon from "../../svg/search.svg";
import { baseURL } from "../../URL";
import useFetch from "../../Hooks/useFetch";

interface PeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPeople: any; // Pass selected Account objects
  taggedPeople: any
}

interface Account {
  id: number;
  fullName: string;
  imageUrl?: string;
}

const PeopleModal: React.FC<PeopleModalProps> = ({ isOpen, onClose, onSelectPeople, taggedPeople }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<Account[]>(taggedPeople); // Store selected Account objects
  const onSuccess = () => { };
  const onError = () => { };
  const url = `${baseURL}/Account/GetAccounts`;

  const { data: accounts, refreshApi: refresh, error: Error, loading: loading } = useFetch(url, "GET", onSuccess, onError);
  const accountsData: Account[] | null = accounts;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleSelect = (account: Account) => {
    const isSelected = selectedPeople.some(person => person.id === account.id);
    const updatedSelectedPeople = isSelected
      ? selectedPeople.filter(person => person.id !== account.id)
      : [...selectedPeople, account];

    setSelectedPeople(updatedSelectedPeople);
    onSelectPeople(updatedSelectedPeople); // Pass selected Account objects
  };

  const filteredPeople: Account[] = accountsData?.filter((person: Account) =>
    person.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  };
  useEffect(() => {
    setSelectedPeople(taggedPeople);
  }, [taggedPeople]);


  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-start pt-20 sm:pt-1 sm:items-center justify-center`}>
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

      <div className="relative p-4 w-full max-w-xl max-h-full">
        <div className='flex justify-center p-4'>
          <span
            className="bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={closeIcon} alt="Close" width={40} height={40} />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5">
            <div className="text-center font-medium mt-2 ">Tag People</div>
            <div className='flex justify-center mt-8 mb-1 mx-2'>
              <div className='relative w-full '>
                <form>
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={handleSearch}
                    className={`w-full bg-white border text-sm rounded-lg p-2 pl-10`}
                    placeholder='Search'
                  />
                  <img
                    src={searchIcon}
                    className='absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer'
                    width={16} height={16}
                    alt="Search"
                  />
                  {searchQuery && (
                    <img
                      src={closeIcon}
                      onClick={clearSearch}
                      className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer'
                      width={16} height={16}
                      alt="Clear"
                    />
                  )}
                </form>
              </div>
            </div>

            <div className="flex flex-wrap justify-center max-h-40 mb-4 overflow-y-auto">
              {filteredPeople.map(person => (
                <div key={person.id} className="relative inline-block mx-4 mt-10 text-center">
                  <input
                    type="checkbox"
                    className="absolute top-0 left-0 mt-1 mr-1"
                    checked={selectedPeople.some(selected => selected.id === person.id)}
                    onChange={() => toggleSelect(person)}
                  />
                  {person.imageUrl ? (
                    <img
                      className="rounded-full border-2 border-white mt-2 mx-4 w-16 h-16"
                      style={{ boxShadow: '0 0 0 1px #0D236E' }}
                      src={person.imageUrl}

                      alt={person.fullName}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center rounded-full border-2 text-customBlue mt-2 mx-4 bg-blue-100 text-customBlue"
                      style={{ width: 60, height: 60, boxShadow: '0 0 0 1px #0D236E' }}
                    >
                      <span className="text-lg font-semibold">{getInitials(person.fullName)}</span>
                    </div>
                  )}
                  <span className="text-xs block mt-1">{person.fullName}</span>
                </div>

              ))}
            </div>

            <div className="flex p-1 my-1 "> <button className="w-full bg-customBlue text-white rounded-lg p-4" onClick={onClose} >
              Tag {selectedPeople.length > 0 && selectedPeople.length} People </button>
            </div>

          </div>


        </div>


      </div>
    </div>
  );
};

export default PeopleModal;
