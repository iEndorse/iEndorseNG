import { useState } from 'react';
import bg from '../../public/images/bg.svg';
import share from '../svg/share.svg';
import endorse from '../svg/endorse.svg';
import Navbar from '../NavBar/Navbar';
import Campaigns2 from './FeedCampaign';
import { Link } from 'react-router-dom';
import { baseURL } from '../URL';
import useFetch from '../Hooks/useFetch';
import edit from '../svg/edit.svg'
import verify from '../svg/verify.svg'
import eye from '../svg/eye.svg'
import promotion from '../svg/promotion.svg'
import { useParams } from 'react-router-dom';
import AnalyticsGraph from './AnalyticsGraph'; 
import AnalyticsBarChart from './AnalyticsBarChart';

 



const Analytics = () => {
  const onSuccess = () => {}
  const onError = () => {}

    const { uid } = useParams();
  const URL = `${baseURL}/Campaign/CampaignAnalytics?CampaignId=${uid}`;
    const { data, refreshApi, error, loading } =  useFetch(URL, "GET", onSuccess, onError);
    const campaignURL = `${baseURL}/Campaign/CampaignDetails?CampaignId=${uid}`
    const { data: campaignData, error: campaignError, loading: campaignLoading } =
     useFetch(campaignURL, "GET", onSuccess, onError);
  return (  
    <>  
    <div className='bg-gray-100 h-screen'>
       <Navbar/>
       <nav className="flex mt-20 px-3 py-5 ml-20" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
            
                <li>
                  <div className="flex items-center">
                    <a href="/Feed" className="ml-1 text-xs text-gray-600 hover:text-gray-800 md:ml-2 "> My Feed</a>

                  </div>
                </li>


                <li>
                  <div className="flex items-center">
                  <svg className="w-2 h-2 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="ml-1 text-xs text-gray-600 hover:text-gray-800 md:ml-2 "> {campaignData?.campaignTitle}</span>

                  </div>
                </li>




                <li>
                  <div className="flex items-center">
                    <svg className="w-2 h-2 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-600 hover:text-gray-800 md:ml-2 ">Analytics</span>
                  </div>
                </li>
              </ol>
            </nav>


       <div className=" flex flex-col bg-gray-100 justify-center items-center  ">
       <div className="p-4 max-w-md bg-white rounded-lg my-5">

       <div className='p-4'>
          <AnalyticsBarChart data={data} />
              </div>
       


            <div className="grid grid-cols-2 gap-2">         
            <div className="flex-col justify-center items-center  w-40  flex-initial py-6 px-2 border bg-white rounded-md m-2 "> 
            <div className="flex justify-center ">
            <img src={share} />
            </div>
            <div className="flex justify-center">
            <p className="text-customBlue font-bold text-2xl my-1"> {data?.totalShares}</p>
            </div>

            <div className="flex text-xs justify-center">
            <p className=" ">Total Shares</p>
            </div>
            </div>
                
            <div className="flex-col justify-center items-center  w-40  flex-initial py-6 px-2 border bg-white rounded-md m-2 "> 
            <div className="flex justify-center ">
            <img src={verify} />
            </div>
            <div className="flex justify-center">
            <p className="text-customBlue font-bold text-2xl my-1"> {data?.totalEndorsements}</p>
            </div>

            <div className="flex  text-xs justify-center">
            <p className=" ">Total Endorsements</p>
            </div>
            </div>
                    </div>




                    
            <div className="grid grid-cols-2 gap-2">         
            <div className="flex-col justify-center items-center  w-40  flex-initial py-6 px-2  border bg-white rounded-md m-2  "> 
            <div className="flex justify-center ">
            <img src={eye} />
            </div>
            <div className="flex justify-center">
            <p className="text-customBlue font-bold text-2xl my-1"> {data?.totalViews}</p>
            </div>

            <div className="flex justify-center">
            <p className="text-xs ">Total Views</p>
            </div>
            </div>
                
            <div className="flex-col justify-center items-center  w-40  flex-initial py-6 px-2 border bg-white rounded-md m-2 "> 
            <div className="flex justify-center ">
            <img src={promotion} />
            </div>
            <div className="flex justify-center">
            <p className="text-customBlue font-bold text-2xl my-1"> {data?.totalPromotions}</p>
            </div>

            <div className="flex justify-center">
            <p className=" text-xs">Total Promotions</p>
            </div>
            </div>
               </div>


 
                        
        </div>
        </div>
        </div>

    </>
  );
};

export default Analytics;
