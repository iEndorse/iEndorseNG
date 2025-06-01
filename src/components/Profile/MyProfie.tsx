import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import dot from './svg/dot.svg';
import send from './svg/send.svg';
import bell from './svg/bell.svg'
import search from './svg/search.svg'
import arrow_left from './svg/arrow_left.svg'
import { baseURL } from '../URL';
import { toast } from 'react-toastify';
import { Puff } from 'react-loader-spinner';
import edit from '../svg/edit.svg'
import edit2 from '../svg/edit2.svg'
import docCopy from '../svg/docCopy.svg'
import EditProfile from './EditProfile';

const MyProfile = () => {
    const userData: any = window.localStorage.getItem("userData");
    const parsedUserData = JSON.parse(userData);
    const [copied, setCopied] = useState(false);
    const token = userData ? JSON.parse(userData).jwtToken : null;
    const [loading, setLoading] = useState(false);
    const [infiniteLoading, setInfiniteLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [formError, setFormError] = useState<string>("");
    const [searchMode, setSearchMode] = useState(false);
    const [apiData, setApiData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [editModal, setEditModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const textToCopy =  parsedUserData.referalCode
    const openEditModal = () => {setEditModal(true); console.log("clicked")}
    const closeEditModal = () => setEditModal(false);
    const url = `${baseURL}/Campaign/MyCampaigns`

    const loadDefaultData = async () => {
        setSearchMode(false);
        setLoading(true);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                },
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const responseData = await response.json();
            setTotalRecords(responseData.totalRecords);
            setApiData(responseData?.data || []);
        } catch (err) {
            toast.error((err as Error).message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadDefaultData();
    }, []);

    useEffect(() => {
        const loadmoredata = async () => {
            setInfiniteLoading(true);
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const responseData = await response.json();
                setTotalRecords(responseData.totalRecords);
                setApiData((prev) => [...prev, ...responseData?.data || []]);
            } catch (err) {
                toast.error((err as Error).message);
            } finally {
                setInfiniteLoading(false);
            }
        };

        if (page > 1) loadmoredata();
    }, [page]);



    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
            if (totalRecords > apiData.length) {
                setPage((prev) => prev + 1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [apiData]);


    const getInitials = (fullName: string) => {
        const names = fullName.split(' ');
        const initials = names.map(name => name[0]).join('');
        return initials.toUpperCase();
    };

    console.log("api data", apiData)


    const submitNewProfile = () =>{
         console.log("submit new profile");   
    }

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
      } catch (err) {
        setCopySuccess('Failed to copy!');
      }
    };

    setTimeout(() => {
      setCopied(false);
    }, 2000);
 


    return (
        <>
        <div className='bg-gray-100 min-h-screen'>
            <Navbar />
            <div className="bg-gray-100 px-10 pt-10 mb-20 mt-10">
                <div className="relative mt-16 max-w-2xl mx-auto  mt-24 rounded-lg">
                    <div className="rounded-3xl overflow-hidden  shadow-md bg-white"> 
                       <div className="flex justify-end p-2 z-100 "  >
                                    <img src={edit2} alt="Edit"    />
                                    <span className='ml-1 text-customBlue mr-1 hidden md:block'  >Edit</span>
                       </div>

                        <div className="absolute -mt-32 w-full flex justify-center "  onClick={openEditModal}>

                            <div className="h-36 w-36 flex items-center justify-center bg-white border-2 border-customBlue rounded-full">
                                <div className="h-32 w-32 flex items-center justify-center  rounded-full">
                                    {parsedUserData.imageUrl ? (
                                        <img
                                            src={parsedUserData.imageUrl}
                                            className="rounded-full object-cover max-h-full max-w-full  shadow-md"
                                            alt="Profile"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full w-full bg-blue-100 rounded-full text-customBlue font-bold text-3xl">
                                            {getInitials(parsedUserData.fullName)}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>


                        <div className="px-6 mt-6 pb-12">
                            <h1 className="font-bold text-3xl text-center mb-1">
                                {parsedUserData.fullName}
                            </h1>
                            <div className="text-gray-500 flex justify-center text-center inline">
      <img src={docCopy} onClick={handleCopy} className="cursor-pointer" alt="Copy icon" />
      <span className="ml-1 mr-2 font-medium">Referral code:</span> {textToCopy}

      {/* Show the copied message only when the user clicks the copy button */}
      {copied && (
        <span className="ml-2 text-green-500 font-medium">
          Copied!
        </span>
      )}
    </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-4 sm:mx-32 mx-10">   

{loading ? (
  // Skeleton Loading State
  <>
    {[...Array(4)].map((_, index) => (
      <div key={index} className="max-w-200 mb-4 h-400 grid rounded-lg border border-gray-200 shadow animate-pulse">
        <div className="h-48 bg-gray-300 rounded-t-lg"></div>
        <div className="p-4 space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="flex items-center space-x-3 mt-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    ))}
  </>
) : apiData && apiData.length > 0 ? (
  // Campaign Data
  apiData.map((item, index) => (
    <Link to={`/ViewCampaign/${item?.campaignId}`} key={index}>
      <div
        className="max-w-200 mb-4 h-400 grid rounded-lg border border-gray-200 shadow"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 1)',
          backgroundImage: `url(${item?.campaignImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          height: 200,
        }}
      >
        <div className="grid flex items-end">
          <div
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(255, 255, 242, 0.00) 0%, rgba(242, 242, 242, 0.08) 14.58%, rgba(242, 242, 242, 0.78) 50%, #F2F2F2 70.83%, #F2F2F2 83.33%, #F2F2F2 100%)`,
            }}
          >
            <div className="flex items-center justify-start pr-4 pl-2 pt-8 mb-2">
              <div className="flex items-center justify-center bg-white border-2 border-customBlue rounded-full w-10 h-10 mx-1">
                <div className="flex items-center justify-center rounded-full w-8 h-8 bg-blue-100">
                  {parsedUserData?.imageUrl ? (
                    <img
                      src={parsedUserData?.imageUrl}
                      className="rounded-full object-cover w-full h-full"
                      alt="Avatar"
                    />
                  ) : (
                    <span className="text-customBlue font-bold text-sm">
                      {getInitials(parsedUserData.fullName)}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="font-semibold text-xs w-20 truncate" style={{ fontSize: '10px' }}>
                  {item?.campaignTitle}
                </div>
                <div
  className="text-xs mt-0 truncate w-20"
  style={{ fontSize: '7px' }}
>
  <i>{item?.description}</i>
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  ))
) : (
  // No Data Message
  !loading && (
    <div className="col-span-4 text-center text-gray-500">
      <p>No campaigns available at the moment.</p>
    </div>
  )
)}

{infiniteLoading && (
  <div className="flex justify-center items-center">
    <p>
      <Puff
        visible={true}
        height="30"
        width="30"
        color="#0D236E"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </p>
  </div>
)}
</div>

</div>

        
        <EditProfile 
        isOpen={editModal}
        onClose={closeEditModal}
        
        
        />
        </>
    );
};

export default MyProfile;
