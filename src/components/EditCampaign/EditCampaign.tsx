import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import Step1 from './Step1';
import Step2 from './Step2'


const EditCampaign = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFieldChange = (fieldName: string) => (e: any) => {
    const value = Array.isArray(e) ? e : e?.target?.value; // Check if the value is an array or from an event object
    setFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: value,
    }));
   // console.log(formData)
  };
  const handleTagChange = (fieldName: string) => (e: any) => {
    const value = Array.isArray(e) ? e : e?.target?.value; // Check if the value is an array or from an event object
    setFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: value,
    }));
   // console.log(formData)
  };
  

  const handleFileChange = (fieldName: string) => (files: string[]) => {
    setFormData({
      ...formData,
      [fieldName]: files,
    });
  };

  // const handleSelectPeople = (selected: any) => {
  //   setFormData({ ...formData, selectedPeople: selected });
  // };

  useEffect(() => {
    console.log("FORMData>>>>>>>>>>>>>",formData);
  }, [formData]);

  const renderStep = (currentStep:any, formData:any, handleTagChange:any, handleFieldChange:any,  nextStep:any, prevStep:any) => {
    switch (currentStep) {
      case 1:
        return <Step1 nextStep={nextStep} handleFieldChange={handleFieldChange} handleTagChange={handleFieldChange} handleFileChange={handleFileChange} formData={formData} />;
 
        
      case 2:
        return <Step2 prevStep={prevStep}  handleFieldChange={handleFieldChange}  handleTagChange={handleFieldChange}  formData={formData} />;
      default:
        return (<div>Form Complete</div>);
    }
  };
  

  return(

    <div className='bg-gray-100 h-screen'>
        <Navbar />
    {renderStep(currentStep, formData, handleFieldChange, handleTagChange,  nextStep, prevStep)}
  </div>

  )

};

export default EditCampaign;
