import React, { useState } from 'react';
import { IconPlus, IconClose } from '@/components/ui/icons';

// Define the 'Image' interface with a required 'link' property and an optional 'alt' property
interface Image {
    doi: string;
    explanation: string;
    link: string;
  }

// Define the 'ImagesComponentProps' interface with an 'images' property of type 'Image[]'
interface ImagesComponentProps {
    images: Image[];
}

// Define the 'ImagesComponent' functional component that takes 'images' as a prop
const ImagesComponent: React.FC<ImagesComponentProps> = ({ images }) => {
    const [showMore, setShowMore] = useState(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);

    const ImagesSkeleton = () => (
        <>
            {Array.from({ length: showMore ? 9 : 3 }).map((_, index) => (
                <div key={index} className="w-1/3 p-1">
                    <div className="w-full overflow-hidden aspect-square">
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                </div>
            ))}
        </>
    );

    const handleImageClick = (image: Image) => {
        setSelectedImage(image);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mt-4">
            <div className="flex items-center">
                <h2 className="text-lg font-semibold flex-grow text-black dark:text-white">Images</h2>
                {images.length > 3 && (
                    <button
                        className="text-black dark:text-white focus:outline-none"
                        onClick={() => setShowMore(!showMore)}
                    >
                        {showMore ? <IconClose className="w-6 h-6" /> : <IconPlus className="w-6 h-6" />}
                    </button>
                )}
            </div>
            <div className={`flex flex-wrap mx-1 transition-all duration-500 ${showMore ? 'max-h-[500px]' : 'max-h-[200px]'} overflow-hidden`}>
                {images.length === 0 ? (
                    <ImagesSkeleton />
                ) : (
                    images.slice(0, showMore ? 9 : 3).map((image, index) => (
                        <div
                            key={index}
                            className="transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-200 w-1/3 p-1 cursor-pointer"
                            onClick={() => handleImageClick(image)}
                        >
                            <div className="w-full overflow-hidden aspect-square">
                                <img
                                    src={image.link}
                                    alt={`Image ${index}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-75 transition-opacity" onClick={handleCloseModal}></div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-auto overflow-hidden relative flex" style={{ height: '60vh' }}>
                        <div className="w-1/2 p-4 flex justify-center items-center">
                            <img src={selectedImage.link} alt={'Full size image'} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="w-1/2 p-4 overflow-y-auto">
                            <IconClose className="w-6 h-6 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-150 ease-in-out absolute top-3 right-3" onClick={handleCloseModal} />
                            <div className="text-gray-500 dark:text-gray-400 text-sm space-y-4">
                                {selectedImage.explanation ? selectedImage.explanation : "No additional information available."}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagesComponent;
