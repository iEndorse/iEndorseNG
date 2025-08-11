import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThreeCircles, Puff } from 'react-loader-spinner';
import { toast } from 'sonner';
import bg from '../../public/images/bg.svg';
import bell from '../svg/bell.svg';
import home from '../svg/home.svg';
import search from '../svg/search.svg';
import plus from '../svg/plus.svg';
import feed from '../svg/feed.svg';
import account from '../svg/account.svg';
import share from '../svg/share.svg';
import endorse from '../svg/endorse.svg';
import apple from '../svg/apple.svg';
import playstore from '../svg/playstore.svg';
import SkeletonCampaign from '../SkeletonCampaign';
import Navbar from '../NavBar/Navbar';
import HomeCampaign from './HomeCampaign';
import usePost from '../Hooks/usePost';
import { baseURL } from '../URL';
import { Skeleton } from '@mui/material';
import useFetch from '../Hooks/useFetch';


interface ApiResponse {
  data: any;
  loading: boolean;
  error: Error | null;
  postData: (body: any) => Promise<void>;
  totalRecords: number;
}
const Home = () => {
  const [page, setPage] = useState(1);
  const [dataArray, setDataArray] = useState<any[]>([]);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [loadingScroll, setLoadingScroll] = useState(false);
  const [categoryId, setCategoryId] = useState<number>(Number(sessionStorage.getItem('selectedCategoryId')) || 0);
  const [showNoCampaignsMessage, setShowNoCampaignsMessage] = useState(false);
  // Add states for filter visibility management
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [showStickyFilter, setShowStickyFilter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const onSuccess = () => {
    // setDataArray((prev) => [...prev, ...responseData?.data || []]);
  };
  
  const onError = () => {
    // console.log("error");
  };

  const requestURL = `${baseURL}/Category/GetCategories/`;
  const { data: categories, refreshApi: refreshCategories, error: categoriesError, loading: categoriesLoading } = useFetch(requestURL, "GET", onSuccess, onError);

  const discoverURL = `${baseURL}/Campaign/DiscoverCampaign?CategoryId=${categoryId}&pageNumber=${page}&pageSize=20`;
  const { data, loading, error, postData } = usePost<ApiResponse>(discoverURL);
  const totalRecords = data?.totalRecords || 0;

  // Fetch data based on the current category and page
  useEffect(() => {
    postData({});
  }, [categoryId, page]);

  // Fetch data and handle infinite scroll
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(discoverURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const responseData = await response.json();
        const fetchedData = responseData?.data || [];

        // If category changes, reset data array, otherwise append new data
        if (page === 1) {
          setDataArray(fetchedData);
        } else {
          setDataArray((prev) => [...prev, ...fetchedData]);
        }
      } catch (err) {
       // toast.error((err as Error).message);
       console.log((err as Error).message);
      } finally {
        setInfiniteLoading(false);
      }
    };

    fetchCampaigns();
  }, [page, categoryId]);

  // Handle infinite scroll with sticky filter logic
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Check if we should show sticky filter
    const filterElement = document.getElementById('filter-types');
    if (filterElement) {
      const filterPosition = filterElement.getBoundingClientRect();
      setIsFilterSticky(filterPosition.top <= 0);
    }
    
    // Hide filter when scrolling down past threshold, show when scrolling up
    const scrollThreshold = 100; // Adjust this value as needed
    
    if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
      // Scrolling down past threshold - hide the filter
      setShowStickyFilter(false);
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up - show the filter
      setShowStickyFilter(true);
    }
    
    // Update last scroll position
    setLastScrollY(currentScrollY);
    
    // Handle infinite loading logic
    if (infiniteLoading || dataArray.length >= totalRecords) return;  // Stop if already loading or all records are loaded

    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
      if (dataArray.length < totalRecords) {
        setInfiniteLoading(true);
        setPage((prev) => prev + 1);
      } else {
        console.log("All records loaded:", totalRecords, dataArray.length);
      }
    }
  };

  useEffect(() => {
    if (!loading && !infiniteLoading && !loadingScroll && dataArray.length === 0) {
      const timer = setTimeout(() => {
        setShowNoCampaignsMessage(true);
      }, 1000); // Delay of 1 second (1000 milliseconds)

      return () => clearTimeout(timer); // Clear timer if component unmounts or dependencies change
    } else {
      setShowNoCampaignsMessage(false); // Reset state when loading or data changes
    }
  }, [loading, infiniteLoading, loadingScroll, dataArray]);


  // Handle category change
  const handleCategoryChange = (newCategoryId: any) => {
    setPage(1); // Reset to the first page
    setDataArray([]); // Clear the existing data
    setCategoryId(newCategoryId); // Update the selected category
    setInfiniteLoading(false); // Reset infinite loading state
    sessionStorage.setItem('selectedCategoryId', newCategoryId.toString());
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dataArray.length, totalRecords, lastScrollY]);

  useEffect(() => {
    setLoadingScroll(true); // Start loading when beginning the scroll restoration
  
    // First attempt at scroll restoration
    const timer = setTimeout(() => {
      restoreScrollPosition();
    }, 600);
  
    // Second attempt after images might have loaded
    const longTimer = setTimeout(() => {
      restoreScrollPosition();
    }, 1500);
  
    function restoreScrollPosition() {
      const savedPosition = localStorage.getItem('listScrollPosition');
      if (savedPosition) {
        window.scrollTo({
          top: parseInt(savedPosition),
          behavior: 'auto'
        });
      }
    }
   
    // Only remove the saved position after the longer timer
    const cleanupTimer = setTimeout(() => {
     localStorage.removeItem('listScrollPosition');
     sessionStorage.removeItem('selectedCategoryId');
      setLoadingScroll(false); // End loading after restoring the scroll position
    }, 1500);
  
    return () => {
      clearTimeout(timer);
      clearTimeout(longTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);
  

  return (
    <>
      <Navbar />
      
      
    <>

<div className="hidden sm:block w-full ">
    <div 
      className="w-full min-h-[700px] bg-cover bg-center flex items-center mt-16 "
      style={{
        backgroundImage: 'url(https://res.cloudinary.com/dgso4wgqt/image/upload/v1733496676/hero_awra5e.png)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "Georgia" }}>
            Discover, Endorse, Transform
          </h1>
          <p className="text-base leading-relaxed mb-8 sm:max-w-sm sm:max-w-none">
          Dive into our platform to discover a world of impactful campaigns—whether for businesses, 
          creative endeavors, or meaningful causes. With iEndorse, you have the power to amplify brands you believe in, support visionary creators, and champion transformative initiatives and policies. Every endorsement is a step toward greater influence, a catalyst for change,
           and a commitment to shaping a better tomorrow for all.
          </p>
          <div className="flex space-x-4">
            <Link to="/">
              <button className="bg-customBlue text-white rounded-lg px-5 py-2 flex items-center">
                <img src={apple} alt="App Store" className="w-5 h-5" />
                <div className="ml-2 text-xs">
                  <div>Download on the</div>
                  <div>App Store</div>
                </div>
              </button>
            </Link>
            <Link to="/">
              <button className="bg-customBlue text-white rounded-lg px-5 py-2 flex items-center">
                <img src={playstore} alt="Play Store" className="w-5 h-5" />
                <div className="ml-2 text-xs">
                  <div>Get it on</div>
                  <div>Google Play</div>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>

      <div 
  style={{
    background: 'radial-gradient(circle, rgba(194,192,227,1) 30%, rgba(194,192,227,1) 36%, rgba(255,255,255,1) 66%)',
    backgroundRepeat: 'no-repeat', 
    backgroundSize: 'cover', 
    marginTop: '80px',
    padding: 0, 
    flexDirection: 'column', // Stack children vertically
    justifyContent: 'flex-end' // Align children to the bottom
  }} 
  className="flex flex-col justify-center items-center text-xs sm:hidden block" >
  
  <img 
    src='images/mobileHero.png' 
    alt='hero' 
    className='w-full'
    style={{ 
      objectFit: 'cover', // Ensure the image covers its container
      objectPosition: 'bottom' // Align the image to the bottom of its container
    }} 
  />

  <div className='bg-white p-4 rounded-t-3xl w-full '> 
  <div className="flex mt-2 justify-center sm:hidden space-x-2">
  <Link to="/">
    <button className="bg-customBlue text-white rounded-lg px-2 py-1 flex items-center">
      <img src={apple} alt="Download on the App Store" className="w-5 h-5" />
      <div className="text-start ml-2 text-xs">
        <div>Download on the</div>
        <div>App Store</div>
      </div>
    </button>
  </Link>
  <Link to="/">
    <button className="bg-customBlue text-white rounded-lg px-2 py-1 flex items-center">
      <img src={playstore} alt="Get it on Google Play" className="w-5 h-5" />
      <div className="text-start ml-2 text-xs">
        <div>Get it on</div>
        <div>Google Play</div>
      </div>
    </button>
  </Link>
</div>

    <div className='font-bold text-3xl p-2 px-3 mt-4 mx-2'>
      Discover, Endorse, Transform
    </div>
    <div className='p-2 px-2 text-sm text-base text-justify leading-relaxed mx-4'>
      Dive into our platform to discover a world of impactful campaigns, each 
      one a beacon of hope, a catalyst for transformation. With iEndorse, you have 
      the power to endorse causes close to your heart, amplifying their reach and 
      influence. Every endorsement is a vote for change, a commitment to shaping 
      a better tomorrow for all.
    </div>

  </div>
    </div>


{/* Original non-sticky filter types */}
<div 
  id="filter-types"
  className="flex flex-wrap justify-center p-4 text-xs bg-white sm:bg-gray-100 w-full"
>
  <button 
    className={`px-5 py-2 m-2 rounded-full text-white 
    ${categoryId === 0 ? 'bg-blue-800' : 'bg-customBlue hover:bg-blue-900'}`}
    onClick={() => handleCategoryChange(0)} >
      All Campaigns
    </button>
  {categories?.map((item: any) => (
    <button 
      key={item.id} 
      className={`px-5 py-2 m-2 rounded-full text-white 
        ${item.id === categoryId ? 'bg-blue-800' : 'bg-customBlue hover:bg-blue-900'}`}
      onClick={() => handleCategoryChange(item.id === categoryId ? 0 : item.id)}
    >
      {item.categoryName}
    </button>
  ))}
</div>

{/* Sticky filter that shows/hides based on scroll direction */}
{isFilterSticky && (
  <div 
    className={`fixed top-0 left-0 right-0 z-40 bg-white sm:bg-gray-100 shadow-md p-4 flex flex-wrap justify-center text-xs transition-transform duration-300 ${
      showStickyFilter ? 'transform translate-y-0' : 'transform -translate-y-full'
    }`}
  >
    <button 
      className={`px-5 py-2 m-2 rounded-full text-white 
      ${categoryId === 0 ? 'bg-blue-800' : 'bg-customBlue hover:bg-blue-900'}`}
      onClick={() => handleCategoryChange(0)} >
        All Campaigns
      </button>
    {categories?.map((item: any) => (
      <button 
        key={item.id} 
        className={`px-5 py-2 m-2 rounded-full text-white 
          ${item.id === categoryId ? 'bg-blue-800' : 'bg-customBlue hover:bg-blue-900'}`}
        onClick={() => handleCategoryChange(item.id === categoryId ? 0 : item.id)}
      >
        {item.categoryName}
      </button>
    ))}
  </div>
)}

{loadingScroll && (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
)}

      
      <div className="flex flex-col bg-white sm:bg-gray-100 justify-center items-center overflow-x-hidden">
      {/* {error && <p>Error: {error.message}</p>} */}
      {(loading )&&  !infiniteLoading ? (
  // Display the loading skeleton while data is being fetched
  <SkeletonCampaign />
) : dataArray.length === 0 ? (
  // Display a message when there's no data
<div className="text-center text-gray-500 mt-4 mb-20">
  {showNoCampaignsMessage && <p>No campaigns found.</p>}
</div>

) :
!dataArray ? (
  <div className="text-center text-gray-500 mt-4 mb-20">
    {!loading && !infiniteLoading && <p>Unable to fetch campaigns.</p>}
  </div>
) : 

(
  // Display the actual content once loading is complete
  <>
    {dataArray.map((item, index) => (
      <HomeCampaign key={index} item={item} />
    ))}
    {dataArray.length >= totalRecords && (
      <div className="text-center  text-gray-500 mt-4 mb-20">
        <p>You have reached the end of the campaigns.</p>
      </div>
    )}
  </>
)}



        {infiniteLoading && (
          <div className="flex items-center mt-4 justify-center">
                <div className="flex justify-center items-center ">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-500"></div>
        </div>
          </div>
        )}
      </div>
    </>
    
  

    </>
  );
};

export default Home;