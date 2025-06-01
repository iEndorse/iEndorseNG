import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './NavBar/Navbar';
import phone from './svg/phone.svg'
import email from './svg/email.svg'
import bird from './svg/bird.svg'
import instagram2 from './svg/instagram2.svg'
import whatsApp from './svg/whatsApp.svg'
const Support = () => {
 

    return (
        <>
            <Navbar />
            
            <div className="flex bg-gray-100 justify-center h-screen">
                <div className=" mt-20 ">
             
                      <div className='font-medium text-lg'> 
                        <img width={200} height={200} src='images/support.png' alt='support' className='mx-auto' />  
                      </div>
               
                        <div className=" w-full md:max-w-md p-4 max-w-md border-gray-700 bg-white rounded-lg my-2">
                      
                    <div className="mt-2  text-sm pr-56 border-b border-gray-100">
                        <div className='pb-2   '><img className='mr-5 inline' width={30} height={30} src={phone} />  Call Us
                        </div>
                    </div>


                    <div className="mt-2  text-sm pr-56 border-b  border-gray-100">
                        <div className='pb-2   '><img className='mr-5 inline' width={30} height={30} src={email} /> Email Us
                        </div>
                    </div>

                    <div className="mt-2  text-sm pr-56 border-b  border-gray-100">
                        <div className='pb-2   '><img className='mr-5 inline' width={30} height={30} src={bird} /> Twitter
                        </div>
                    </div>

                    <div className="mt-2  text-sm pr-56 border-b  border-gray-100">
                        <div className='pb-2   '><img className='mr-5 inline' width={30} height={30} src={instagram2} /> Instagram
                        </div>
                    </div>

                    <div className="mt-2  text-sm pr-56 border-b  border-gray-100">
                        <div className='pb-2   '><img className='mr-5 inline' width={30} height={30} src={whatsApp} /> WhatsApp
                        </div>
                    </div>

 
                        </div>
                </div>
            </div>



            


        </>


    );
};

export default Support;
