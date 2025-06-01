import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import upload from '../svg/upload.svg'; 
import useFetch from '../Hooks/useFetch';
import { baseURL } from '../URL';
import PeopleModal from './Modals/PeopleModal';
import add from '../svg/add.svg';
import cancel from '../svg/cancel.svg';
import { Backdrop, CircularProgress } from "@mui/material";

interface person {
  id: number;
  fullName: string;
  imageUrl?: string;
}

const Step1 = ({ nextStep, handleFieldChange, handleTagChange, handleFileChange, handleRawFileChange, formData }: any) => {
  const [peopleModal, setPeopleModal] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>(formData.tags || []);
  const [isLoaded, setIsLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [uploadedMedia, setUploadedMedia] = useState<any[]>(formData.campaignMedias || []);


  const closePeopleModal = () => {
    setPeopleModal(false);
  };
  const openPeopleModal = () => {
    setPeopleModal(true);
  };

  const onSuccess = () => {
    // console.log("success");
  };
  const onError = () => {
    // console.log("error");
  };

  const getInitials = (name: string) => {
    if (name !== null) {
      const nameParts = name.split(' ');
      return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    } else {
      return "";
    }
  };

  const handleSelectPeople = (selected: any) => {
    setSelectedPeople(selected);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  const handleCampaignMedias = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    if (target && target.files && target.files.length > 0) {
      const newFiles = Array.from(target.files) as File[];


      const images = newFiles.filter(file => file.type.startsWith('image/'));

      const videos = newFiles.filter(file => file.type.startsWith('video/'));

      // Convert images to Base64
      const newBase64Images = await Promise.all(
        images.map(async (image) => ({
          fileExtension: `.${image.name.split('.').pop()}`, // Extract file extension from name
          campaignMedia: await convertToBase64(image),
        }))
      );

      // Convert videos to Base64 asynchronously
      const newBase64Videos = await Promise.all(
        videos.map(async (video) => ({
          fileExtension: `.${video.name.split('.').pop()}`, // Extract file extension from name
          campaignMedia: await convertToBase64(video),
        }))
      );

      // Combine images and videos
      const newMediaItems = [...newBase64Images, ...newBase64Videos];

      // Remove duplicates and maintain a maximum of 5 items
      const combinedMedia = [
        ...uploadedMedia,

        ...newMediaItems.filter(newItem =>
          uploadedMedia.every(
            existing =>
              existing.campaignMedia !== newItem.campaignMedia
          )
        ),
      ];

      if (combinedMedia.length > 5) {
        setError({
          ...error,
          campaignMedias: 'You can upload a maximum of 5 media items (images or videos).',
        });
        return;
      }

      setError({ ...error, campaignMedias: '' });
      setUploadedMedia(combinedMedia);

      // Update the parent form data
      handleFileChange('campaignMedias')(combinedMedia);
      handleRawFileChange('rawPhotos')(images);
      handleRawFileChange('rawVideos')(videos);

    }
  };



  const removePerson = (id: number) => {
    const updatedPeople = selectedPeople.filter((person: any) => person.id !== id);
    handleSelectPeople(updatedPeople);
  };

  // const removeImage = (index: number) => {
  //   const updatedImages = uploadedImages.filter((_, i) => i !== index);
  //   setUploadedImages(updatedImages);
  // };

  // const removeVideo = (index: number) => {
  //   const updatedVideos = uploadedVideos.filter((_, i) => i !== index);
  //   setUploadedVideos(updatedVideos);
  // };

  const removeMedia = (index: number) => {
    const updatedMedia = uploadedMedia.filter((_, i) => i !== index);
    setUploadedMedia(updatedMedia);
  };

  const requestURL = `${baseURL}/Category/GetCategories/`;
  const { data: categories, refreshApi: refreshCategories, error: categoriestError, loading: categoriesLoading } = useFetch(requestURL, "GET", onSuccess, onError);

  useEffect(() => {
    handleTagChange('tags')(selectedPeople); // Pass the entire selectedPeople object array
  }, [selectedPeople]);


  const handleNextStep = () => {
    let formIsValid = true;
    const newErrors: { [key: string]: string } = {};

    // Campaign Title validation
    if (!formData.CampaignTitle) {
      newErrors.CampaignTitle = 'Please enter a title.';
      formIsValid = false;
    }


    // Campaign Category validation
    if (!formData.CampaignCategory) {
      newErrors.CampaignCategory = 'Please select a campaign category.';
      formIsValid = false;
    }

    // Campaign Link validation
    if (!formData.CampaignLink) {
      newErrors.CampaignLink = 'Please provide a campaign link.';
      formIsValid = false;
    } else if (!/^(www\.)?[^\s$.?#].[^\s]*$/.test(formData.CampaignLink)) {
      newErrors.CampaignLink = 'Please provide a valid URL.';
      formIsValid = false;
    }
    // Description validation
    if (!formData.Description) {
      newErrors.Description = 'Please provide a description.';
      formIsValid = false;
    }


    if (!formData.campaignMedias || formData.campaignMedias.length === 0) {
      newErrors.campaignMedias = 'Please upload at least one media file.';
      formIsValid = false;
    }
    setError(newErrors);

    if (formIsValid) {
      nextStep();
    }
  };


  const triggerFileInput = () => {
    fileInputRef.current?.click();
  }


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;

    // Update state (respecting max length)
    if (value.length <= 300) {
      handleFileChange("Description")(value);
    }
  };


  return (
    <>
      <div className="flex bg-gray-100 justify-center text-xs  ">
        <div className='bg-white p-5 rounded-lg max-w-md h-auto mb-10 mt-36  mx-5'>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={categoriesLoading}>
            <div className="flex items-center mt-4 justify-center">
              <div className="flex justify-center items-center ">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-500"></div>
              </div>
            </div>
          </Backdrop>

          <div className="flex items-center justify-center mb-5">
            <div className="flex-1 border-2 border-t border-customBlue"></div>
            <div className="flex-1 border-t border-a-300"></div>
          </div>
          <img
            src="https://res.cloudinary.com/dgso4wgqt/image/upload/v1733390897/frame1_pqfed6.png"
            alt="frame1"
            onLoad={() => setIsLoaded(true)}
            className={`w-full transition-all duration-500 ${isLoaded ? "blur-0" : "blur-md"
              }`}
          />

          <form className="space-y-4 mt-4 " action="#" onSubmit={(e) => { e.preventDefault() }}>
            <div>
              <select
                name="CampaignCategory"
                onChange={handleFieldChange('CampaignCategory')} value={formData.CampaignCategory}
                className={`border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              >
                <option selected disabled>Campaign Category</option>
                {categories?.map((item: any) => (
                  <option key={item.id} value={item.id}>{item.categoryName}</option>
                ))}
              </select>
              {error.CampaignCategory && <p className="text-red-500 text-xs  ml-1 my-1">{error.CampaignCategory}</p>}
            </div>

            <div>
              <input
                placeholder='Campaign Title'
                name="CampaignTitle"
                onChange={handleFieldChange('CampaignTitle')} value={formData.CampaignTitle}
                className={`border border-gray-300 text-gray-700 rounded-lg  text-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${error.CampaignTitle ? 'border-red-500' : ''}`}
              />
              {error.CampaignTitle && <p className="text-red-500 text-xs  ml-1 my-1">{error.CampaignTitle}</p>}
            </div>

            <div>
              <input
                placeholder='Campaign Link'
                name="CampaignLink"
                onChange={handleFieldChange('CampaignLink')} value={formData.CampaignLink}
                className="border text-md  border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 
                focus:border-blue-500 block w-full p-2.5"
              />
              {error.CampaignLink && <p className="text-red-500 text-xs ml-1 my-1">{error.CampaignLink}</p>}
            </div>

            <div>
            <textarea
        placeholder="Description"
        name="Description"
        maxLength={300}
        value={formData.Description}
        onChange={handleChange}
        className="border text-sm border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 overflow-hidden resize-none leading-relaxed"
        rows={3} // Start small, grow as needed
      />

      <div className="text-sm text-gray-500 text-right mt-1">
        {formData?.Description?.length}/{300} characters
      </div>

              {error.Description && <p className="text-red-500 text-xs ml-1 my-1">{error.Description}</p>}

            </div>

            <div>


            </div>

            <div className={`${selectedPeople.length > 0 ? 'hidden' : ''}`}>
              <input
                onClick={openPeopleModal}

                readOnly

                className="border border-gray-300  text-md text-a-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Tag People"
              />
            </div>


            {selectedPeople.length == 0 ? ' ' : <>

              <div className='border-2 p-4 rounded-lg'>
                <div className='text-gray-700 pb-1' > You Tagged</div>
                <div className="flex flex-wrap justify-start max-h-40 overflow-y-auto">

                  {selectedPeople.map(person => (
                    <div key={person.id} className="relative inline-block mx-4 mt-3 text-center">
                      <img
                        src={cancel}
                        className="absolute   cursor-pointer"
                        onClick={() => removePerson(person.id)} // Call removePerson on click
                        alt="Remove"
                      />
                      {person.imageUrl ? (
                        <img
                          className="rounded-full border-2 border-white mt-2 w-10 h-10 mx-4"
                          style={{ boxShadow: '0 0 0 1px #0D236E' }}
                          src={person.imageUrl}

                          alt={person.fullName}
                        />
                      ) : (
                        <div
                          className="flex items-center justify-center rounded-full border-2 text-customBlue mt-2 mx-4 bg-blue-100 text-customBlue"
                          style={{ width: 38, height: 38, boxShadow: '0 0 0 1px #0D236E' }}
                        >
                          <span className="text-sm font-semibold">{getInitials(person.fullName)}</span>
                        </div>
                      )}
                      <span className="text-xs block mt-1 font-medium">{person.fullName}</span>
                    </div>

                  ))}



                  <div className='  '>
                    <img onClick={openPeopleModal} src={add} width={40} height={40} className='my-4' />

                  </div>
                </div>
              </div>
            </>}

            <div>
              {/* Hidden File Input */}
              <input
                type="file"
                name="campaignMedias"
                accept="image/*,video/*"
                onChange={handleCampaignMedias}
                multiple
                className="hidden"
                ref={fileInputRef}
              />

              {uploadedMedia.length > 0 && (
                <div className="border-2 p-4 rounded-lg">
                  <div className="text-gray-700 pb-1">Uploaded Media</div>
                  <div className="flex flex-wrap justify-start max-h-40 overflow-y-auto">
                    {uploadedMedia.map((media, index) => (
                      <div key={index} className="relative inline-block mx-2 mt-3">
                        {/* Remove Button */}
                        <img
                          src={cancel}
                          alt="Remove"
                          onClick={() => removeMedia(index)}
                          className="absolute cursor-pointer"
                          style={{ top: '-5px', right: '-5px', width: '20px', height: '20px'  }}
                        />

                        {/* Check if media is an image or video */}
                        {media.fileExtension.startsWith('.jpg') || media.fileExtension.startsWith('.jpeg') || media.fileExtension.startsWith('.png') ? (
                          <img
                            src={media.campaignMedia}
                            alt={`Uploaded ${index + 1}`}
                            className="max-w-full max-h-full"
                          />
                        ) : (
                          <video controls className="max-w-full max-h-full">
                            <source src={media.campaignMedia} type={`video/${media.fileExtension.slice(1)}`} />
                          </video>
                        )}
                      </div>
                    ))}

                    {/* Add Media Button */}
                    {uploadedMedia.length < 5 && (
                      <div className="relative inline-block mx-4 mt-3">
                        <img
                          onClick={triggerFileInput}
                          src={add}
                          alt="Add Media"
                          width={40}
                          height={40}
                          className="my-4"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error.campaignMedias && <p className="text-red-500 text-xs ml-1 my-1">{error.campaignMedias}</p>}

              {/* Upload Button */}
              {uploadedMedia.length === 0 && (
                <button
                  onClick={triggerFileInput}
                  className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center"
                >
                  <img src={upload} alt="Upload" className="inline-block mr-2" />
                  Upload Campaign Media
                </button>
              )}
            </div>


            {/* End Upload Campaign Media Section */}
            {error.fileUpload && <p className="text-red-500 text-xs pb-8">{error.fileUpload}</p>}



            <button
              onClick={handleNextStep}
              className="w-full text-white bg-customBlue hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Next
            </button>
          </form>
        </div>
      </div>

      {/* People Modal */}
      <PeopleModal
        isOpen={peopleModal}
        onClose={closePeopleModal}
        onSelectPeople={handleSelectPeople}
        taggedPeople={selectedPeople}
      />
    </>
  );
};

export default Step1;
