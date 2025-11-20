import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import heroPicture from "../assets/hero_bitsa.jpg";
import api from "../api/api";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get("/gallery");
        setImages(res.data);
      } catch (err) {
        console.error(err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const heroImage = images[0] || null;
  const featuredImage1 = images[1] || null;
  const sidebarImage1 = images[2] || null;
  const halfImage1 = images[3] || null;
  const halfImage2 = images[4] || null;
  const featuredImage2 = images[5] || null;
  const sidebarImage2 = images[6] || null;
  const gridImages = images.slice(7); 

  const SpecialImageCard = ({ image, size, delay }) => {
    if (!image) return null;

    const baseClasses = "relative cursor-pointer overflow-hidden rounded-xl shadow-2xl";
    const height = size === "featured" ? "h-[450px]" : "h-[300px]"; 
    
    const titleClass = size === "featured" ? "text-2xl" : "text-xl";
    const descClass = size === "featured" ? "text-base" : "text-sm";
    const padding = size === "featured" ? "p-6" : "p-4";

    return (
      <motion.div
        className={baseClasses}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: delay }}
        whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
        onClick={() => setSelectedImage(image)}
      >
        <img
          src={image.imageUrl}
          alt={image.title}
          className={`w-full object-cover ${height}`}
          layoutId={`image-${image._id}`}
          transition={{ duration: 0.3 }}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end ${padding} text-white`}>
            <h3 className={`${titleClass} font-bold mb-1 line-clamp-2`}>
                {image.title}
            </h3>
            {image.description && (
                <p className={`${descClass} font-light line-clamp-3`}>
                    {image.description}
                </p>
            )}
            <span className="text-xs font-medium mt-2 flex items-center gap-2 text-blue-300">
                <Calendar className="w-4 h-4" /> {formatDate(image.createdAt)}
            </span>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="relative min-h-screen flex flex-col">

      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroPicture})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <motion.header 
        className="relative z-10 py-8 text-center text-white bg-black/30 backdrop-blur-sm shadow-xl"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Capturing the BITSA Spirit</h1>
        <p className="text-xl mt-3 font-light text-gray-200">
          Relive moments from our events, activities & adventures
        </p>
      </motion.header>

      <main className="relative z-10 flex-1 overflow-y-auto pt-10">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
            <p className="mt-4 text-gray-100">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <Card className="text-center p-12 shadow-xl border border-blue-400 bg-white/95 max-w-lg mx-auto mt-10">
            <CardContent>
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <p className="text-xl text-gray-700 font-semibold">No photos uploaded yet</p>
              <p className="text-gray-500 mt-2">
                Check back later for new photos!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {heroImage && (
              <motion.div
                className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="w-full relative cursor-pointer overflow-hidden rounded-xl shadow-2xl"
                  whileHover={{ scale: 1.005, boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}
                  onClick={() => setSelectedImage(heroImage)}
                >
                    <img
                      src={heroImage.imageUrl}
                      alt={heroImage.title}
                      className="w-full object-cover max-h-[80vh] min-h-[50vh]"
                      layoutId={`image-${heroImage._id}`}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
                        <h2 className="text-4xl md:text-6xl font-bold mb-2">
                            {heroImage.title}
                        </h2>
                        {heroImage.description && (
                            <p className="text-lg md:text-xl font-light max-w-3xl">
                                {heroImage.description}
                            </p>
                        )}
                        <span className="text-sm font-medium mt-2 flex items-center gap-2">
                            <Calendar className="w-5 h-5" /> {formatDate(heroImage.createdAt)}
                        </span>
                    </div>
                </motion.div>
              </motion.div>
            )}
            
            {(featuredImage1 || sidebarImage1) && (
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6">Featured Moments</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                            <SpecialImageCard image={featuredImage1} size="featured" delay={0.2} />
                        </div>

                        <div className="lg:col-span-1">
                            <SpecialImageCard image={sidebarImage1} size="featured" delay={0.4} />
                        </div>
                    </div>
                </div>
            )}
            
            {(halfImage1 || halfImage2) && (
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6">Recent Activities</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SpecialImageCard image={halfImage1} size="half" delay={0.6} />
                        
                        <SpecialImageCard image={halfImage2} size="half" delay={0.8} />
                    </div>
                </div>
            )}

            {(featuredImage2 || sidebarImage2) && (
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6">Throwback Events</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                            <SpecialImageCard image={featuredImage2} size="featured" delay={1.0} />
                        </div>

                        <div className="lg:col-span-1">
                            <SpecialImageCard image={sidebarImage2} size="featured" delay={1.2} />
                        </div>
                    </div>
                </div>
            )}


            {gridImages.length > 0 && (
                <>
                <h2 className="text-3xl font-bold text-white mb-6 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">Gallery Highlights</h2>
                <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 gap-6 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
                    {gridImages.map((image, index) => (
                      <motion.div
                        key={image._id}
                        className="cursor-pointer mb-6 break-inside-avoid"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                        whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
                        onClick={() => setSelectedImage(image)}
                      >
                        <Card className="overflow-hidden p-2 rounded-xl shadow-2xl bg-blue-300 backdrop-blur-md transition-all duration-300">
                          <div className="relative">
                            <motion.img
                              src={image.imageUrl}
                              alt={image.title}
                              className="w-full object-cover rounded-lg" 
                              layoutId={`image-${image._id}`}
                              transition={{ duration: 0.3 }}
                            />

                            <div className="absolute top-3 right-3 bg-blue-600/95 px-3 py-1 rounded-full text-sm font-semibold text-white flex items-center gap-2 shadow-lg">
                              <Calendar className="w-4 h-4" />
                              {formatDate(image.createdAt)}
                            </div>
                          </div>

                          <CardContent className="p-4">
                            <h3 className="text-xl font-bold text-blue-800 mb-1 line-clamp-2">
                              {image.title}
                            </h3>

                            {image.description && (
                              <p className="text-base text-gray-700 line-clamp-3">
                                {image.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
                </>
            )}
          </>
        )}
      </main>

      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-blue-400 transition p-2 bg-white/10 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              layoutId={`image-${selectedImage._id}`}
              transition={{ duration: 0.3 }}
            />

            <div className="mt-6 text-center bg-white/10 rounded-xl p-6 backdrop-blur-md">
              <h2 className="text-3xl text-white font-bold mb-2">{selectedImage.title}</h2>

              {selectedImage.description && (
                <p className="text-gray-300 text-lg mb-3">
                  {selectedImage.description}
                </p>
              )}

              <div className="flex items-center justify-center text-blue-200 gap-2 font-medium">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(selectedImage.createdAt)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Gallery;