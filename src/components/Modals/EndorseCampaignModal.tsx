import React, { useEffect, useState } from 'react';
import close from '../svg/close.svg';

interface EndorseCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (units: number, note: string) => void;
}

const EndorseCampaignModal: React.FC<EndorseCampaignModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [note, setNote] = useState("");
  const [units, setUnits] = useState<number>(0);
  const [noteError, setNoteError] = useState("");
  const [unitsError, setUnitsError] = useState("");

  const handleNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    if (e.target.value.trim()) {
      setNoteError(""); // Clear error when valid input
    }
  };

  const handleNumberOfUnits = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits in the input
    const sanitizedValue = e.target.value.replace(/\D/g, '');

    // Convert to number or default to 0 if empty
    const value = sanitizedValue === '' ? 0 : parseInt(sanitizedValue);

    // Update state
    setUnits(value);
    setUnitsError(value === 0 && sanitizedValue !== '' ? "Please enter a valid number of units." : "");
  };

  const handleSubmit = () => {
    let isValid = true;

    if (!note.trim()) {
      setNoteError("Please enter a note.");
      isValid = false;
    }

    if (isNaN(units) || units <= 0) {
      setUnitsError("Please enter a valid number of units.");
      isValid = false;
    }

    if (isValid) {
      onSubmit(units, note);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setNote("");
      setUnits(0);
      setNoteError("");
      setUnitsError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 transition-opacity flex items-start mt-20 sm:mt-1 sm:items-center justify-center">
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>

      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="flex justify-center p-4">
          <span
            className="bg-transparent border-0 text-black  text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <img src={close} alt="x" width={40} height={40} className='mt-2 pt-2' />
          </span>
        </div>
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5">
            <h1 className="text-center font-bold mb-4">Endorse Campaign </h1>

            <div className="flex-col max-w-sm space-y-2 justify-center mb-10">
              <div>

                <input
                  onChange={handleNumberOfUnits}
                  id="units"
                  value={units || ''}
                  className="w-full py-2 px-3 text-md mb-1 rounded-md border text-gray-900"
                  placeholder="Number of units"
                  type="text" // Using "text" instead of "number" for better control
                  inputMode="numeric" // Shows numeric keyboard on mobile
                />

                {unitsError &&
                  <p className="text-red-500 text-xs mb-2 mx-1">{unitsError}</p>}
                <div className="mt-2 mb-4">

                  { /* units > 0 &&   
                <span className="bg-blue-50 text-blue-500 px-2 text-md rounded-full py-2 mt-2">
                    1000 naira equals 1 unit
                  </span>
                  */}
                </div>
              </div>

              <div className="flex items-center border border-gray-200 rounded-lg mt-20">
                <div className="w-full">
                  <textarea
                    onChange={handleNote}
                    name="note"
                    id="note"
                    value={note}
                    rows={6}
                    className="resize-none text-gray-900 text-md block w-full p-2.5"
                    placeholder="Leave an Endorse note"
                  />

                </div>

              </div>
              {noteError && <p className="text-red-500 text-sm">{noteError}</p>}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {note !== '' && units > 0 ? 'Proceed to Pay' : 'Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndorseCampaignModal;
