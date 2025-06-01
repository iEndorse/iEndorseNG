import React from "react";
import dot from '../svg/dot.svg';
import send from '../svg/send.svg';
import bell from '../svg/bell.svg';
import { baseURL } from "../URL";
import { Link } from "react-router-dom";
import {toast} from 'react-toastify';

const NotificationCard = ({item}: any) => {
   
   
    function formatDate(timestamp:string) {
        const dateObj = new Date(timestamp);
        const options:any = { year: 'numeric', month: 'long', day: 'numeric' };
        return dateObj.toLocaleDateString('en-GB', options);
      }     const MarkAsRead = async (id: number) => {
        try {
          const response = await fetch(`${baseURL}/EndorseNotification/ReadNotification?NotificationId=${id}`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
            },   
          });
      
          if (response.ok) {
            console.log('Notification marked as read');
           // toast.success("Mark as Read")
          } else {
            console.error('Failed to mark notification as read');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      
      
    return (
        <div>

            <Link to={`/ViewCampaign/${item.id}`} onClick={() => MarkAsRead(item.id)}>
              <div className="p-4 max-w-md border-gray-700 bg-white rounded-lg my-2">
                            <div className="flex items-center justify-between">
                                <div className="flex mb-3">
                                    <div className="mr-4   rounded-full  mx-1">
                                       <div> 
                                         <img src={item.image}   alt="notification" className="rounded-full h-8 w-8 mt-1" />
                                       </div>
                                       </div>
                                        <div className="text-sm"> <div className="font-medium">{item.accountName}</div>
                                        <div className="text-xs">{item.occupation}</div></div>
                                   
                                    
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
                                    <p className="text-xs mt-10">
                                       {formatDate(item?.notficationDate)}
                                    </p>
                                </div>
                            </div>
                        </div>  

                        </Link>
        </div>
    )
}
export default NotificationCard