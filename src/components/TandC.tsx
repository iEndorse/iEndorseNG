import React, { useState } from 'react';
import Navbar from './NavBar/Navbar';

const PolicyComponent = () => {
  const [activeTab, setActiveTab] = useState('terms');

  const renderTerms = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
      <p className="text-sm text-gray-600 mb-4">Last updated: November 24, 2024</p>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Interpretation and Definitions</h2>
        
        <h3 className="text-xl font-medium mb-3">Definitions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Application:</strong> Software program named iEndorse
          </li>
          <li>
            <strong>Company:</strong> SquarePyramid Limited, 6 Eva Road, Toronto, Ontario, M9C 0B1
          </li>
          <li>
            <strong>Service:</strong> Refers to the Application or Website
          </li>
          <li>
            <strong>Website:</strong> iEndorse, accessible from <a href="www.iendorse.ng" className="text-blue-600 hover:underline">www.iendorse.ng</a>
          </li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Key Highlights</h2>
        
        <div className="space-y-4">
          <p>
            By accessing or using the Service, You agree to these Terms and Conditions. 
            You must be over 18 to use the Service.
          </p>
          
          <p>
            The Company may terminate Your access immediately for any reason, including 
            breach of these Terms and Conditions.
          </p>
          
          <p>
            The Service is provided "AS IS" and "AS AVAILABLE" without any warranties.
          </p>
        </div>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
        
        <p>
          The entire liability of the Company is limited to the amount actually paid by 
          You through the Service or 100 USD if You haven't purchased anything.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        
        <div>
          <p>Email: <a href="mailto:info@iendorse.ng" className="text-blue-600 hover:underline">info@iendorse.ng</a></p>
          <p>Website: <a href="https://www.iendorse.ng" className="text-blue-600 hover:underline">www.iendorse.ng</a></p>
        </div>
      </section>
    </div>
  );

  const renderPrivacyPolicy = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <p className="text-sm text-gray-600 mb-4">Last updated: November 24, 2024</p>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Types of Data Collected</h2>
        
        <div className="space-y-4">
          <p>
            While using Our Service, We may collect the following personally identifiable information:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Usage Data</li>
          </ul>
        </div>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Use of Your Personal Data</h2>
        
        <p>
          The Company may use Your Personal Data for the following purposes:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>To provide and maintain our Service</li>
          <li>To manage Your Account</li>
          <li>To perform contract obligations</li>
          <li>To contact You with updates or communications</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
        
        <p>
          We may share Your personal information in the following situations:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>With Service Providers</li>
          <li>For business transfers</li>
          <li>With Affiliates</li>
          <li>With Your consent</li>
        </ul>
      </section>
    </div>
  );

  const renderCookiesPolicy = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">Cookies Policy</h1>
      
      <p className="text-sm text-gray-600 mb-4">Last updated: November 24, 2024</p>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
        
        <p className="mb-4">
          Cookies are small files that are placed on Your computer, mobile device, or any other device by a website, containing details of Your browsing history.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Necessary Cookies:</strong> Essential for providing you with services and features of the website
          </li>
          <li>
            <strong>Functionality Cookies:</strong> Help remember your preferences and provide a more personalized experience
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how users interact with our website
          </li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
        
        <p>
          You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
        </p>
      </section>
    </div>
  );

  return (
    <>
    <Navbar />
   
    <div className="max-w-4xl mx-auto p-6">
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b">
        <button 
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 ${activeTab === 'terms' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Terms
        </button>
        <button 
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 ${activeTab === 'privacy' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Privacy Policy
        </button>
        <button 
          onClick={() => setActiveTab('cookies')}
          className={`px-4 py-2 ${activeTab === 'cookies' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          Cookies Policy
        </button>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'terms' && renderTerms()}
        {activeTab === 'privacy' && renderPrivacyPolicy()}
        {activeTab === 'cookies' && renderCookiesPolicy()}
      </div>
    </div>
    </>

  );
};

export default PolicyComponent;