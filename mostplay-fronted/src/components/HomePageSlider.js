import React, { useEffect } from 'react';
import banner_1 from '../assets/banner_1.jpg';
import banner_pc from '../assets/banner_pc_1.jpg';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { getCarouselImages } from '../features/carousel/carouselControlThunks';
import { baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

// Fallback loading component
const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <p>Loading carousel...</p>
  </div>
);

// Error component
const ErrorMessage = ({ message }) => (
  <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
    <p>{message}</p>
  </div>
);

export default function HomePageSlider() {
  const {
    images = [], // Array of objects with mobile and desktop URLs
    isActive: storeIsActive = false,
    interval: storeInterval = 3000,
    infiniteLoop: storeInfiniteLoop = true,
    autoPlay: storeAutoPlay = true,
    isLoading = false,
    isError = false,
    errorMessage = 'An error occurred while loading the carousel',
    _id,
  } = useSelector((state) => state.homePageCarousel);

  const dispatch = useDispatch();

  // Fetch carousel images on component mount
  useEffect(() => {
    if (storeIsActive && !_id) {
      dispatch(getCarouselImages());
    }
  }, [dispatch, storeIsActive, _id]);

  // Determine if the device is desktop based on window width
  const isDesktop = window.innerWidth >= 1024;

  // Fallback to static images if no images are provided from Redux
  const fallbackImages = [
    { mobile: banner_1, desktop: banner_pc },
    { mobile: banner_1, desktop: banner_pc },
    { mobile: banner_1, desktop: banner_pc },
  ];

  // Use images from Redux if available, otherwise use fallback
  const carouselImages = images.length > 0 ? images : fallbackImages;

  // Render loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render error state
  if (isError) {
    return <ErrorMessage message={errorMessage} />;
  }

  return (
    <div className="homepage-slider" style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Carousel
        showThumbs={false} // Hide thumbnail navigation
        showStatus={false} // Hide status indicator (e.g., 1/3)
        showArrows={true} // Show navigation arrows
        autoPlay={storeIsActive && storeAutoPlay} // Only autoplay if carousel is active
        infiniteLoop={storeInfiniteLoop} // Enable infinite loop
        interval={storeInterval} // Slide transition interval
        stopOnHover={true} // Pause on hover
        swipeable={true} // Enable swipe gestures
        dynamicHeight={false} // Fixed height for consistency
        emulateTouch={true} // Enable touch emulation for non-touch devices
        useKeyboardArrows={true} // Enable keyboard navigation
        transitionTime={500} // Smooth transition duration
        showIndicators={true} // Show dot indicators
        className="carousel-container"
      >
        {carouselImages.map((image, index) => (
          <div key={image._id || index}>
            <img
              src={isDesktop ? `${baseURL_For_IMG_UPLOAD}s/${image.desktop}` : `${baseURL_For_IMG_UPLOAD}s/${image.mobile}`}
              alt={`Carousel slide ${index + 1}`}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                maxHeight: isDesktop ? '600px' : '400px', // Responsive height
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}