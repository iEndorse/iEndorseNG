import React from "react";
import dot from '../svg/dot.svg';
import send from '../svg/send.svg';
import bell from '../svg/bell.svg';
import { Link } from "react-router-dom";
import { baseURL } from "../URL";
import { toast } from 'react-toastify';

const EndorsementCard = ({item}: any) => {
  
  // const markAsReadUrl =   `${baseURL}/EndorseNotification/ReadNotification`;
   

  
    function formatDate(timestamp:string) {
        const dateObj = new Date(timestamp);
        const options:any = { year: 'numeric', month: 'long', day: 'numeric' };
        return dateObj.toLocaleDateString('en-GB', options);
      }
      const MarkAsRead = async (id: number) => {
        try {
          const response = await fetch(`${baseURL}/EndorseNotification/ReadNotification?NotificationId=${id}`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
            },   
          });
      
          if (response.ok) {
            console.log('Notification marked as read');
          //  toast.success("Mark as Read")
          } else {
            console.error('Failed to mark notification as read');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      

      const SendThankYou = async (id: number) => {
        try {
          const response = await fetch(`${baseURL}/EndorseNotification/ReadNotification?NotificationId=${id}`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },   
          });
      
          if (response.ok) {
            console.log('Notification marked as read');
          //  toast.success("Mark as Read")
          } else {
            console.error('Failed to mark notification as read');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };


      
    return (
        <div>
                       
            <Link to={`/ViewCampaign/${item.campaignId}`} onClick={()=> MarkAsRead(item.id)}>
              <div className="p-4 max-w-md border-gray-700 bg-white rounded-lg my-2" >
                            <div className="flex items-center justify-between ">
                                <div className="flex">
                                    <div className="mr-4   rounded-full  mx-1">
                                        <img src={bell}   alt="notification" className="" />
                                    </div>
                                    
                                </div>
                                <div className="mouse-pointer">
                                  {!item.isRead &&   <img src={dot} alt="dot" />}  
                                </div>
                            </div>
                            <div className="my-2 pr-20">
                                <h1 className="font-medium">
                                  {item.title}
                                </h1>
                                <div className="mt-2">
                                   {item.message}

                                 
                               <div className="flex items-center my-2"  onClick={()=> SendThankYou(item.id)}>
                                <img src={send} alt="send" className="mr-1" />
                                <span className='text-customBlue font-medium'>Send A Thank You</span>
                                </div>
                            

                                    <p className="text-xs mt-4">
                                       {formatDate(item?.notficationDate)}
                                    </p>
                                </div>
                            </div>
              </div>  
        </Link>
        </div>
    )
}
export default EndorsementCard