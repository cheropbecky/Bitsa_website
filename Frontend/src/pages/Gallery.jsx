import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import heroPicture from "../assets/hero_bitsa.jpg";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("http://localhost:5500/api/gallery");
        if (!res.ok) throw new Error("Failed to fetch gallery images");
        const data = await res.json();
        setImages(data);
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

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Static Background */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroPicture})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 text-center text-white bg-black/20 backdrop-blur-sm">
        <h1 className="text-4xl md:text-5xl font-bold">Capturing the BITSA Spirit</h1>
        <p className="text-lg mt-2 font-semibold">
          Relive the most memorable moments from our events and activities
        </p>
      </header>

      {/* Scrollable Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-100">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <Card className="text-center p-12 shadow border border-blue-200 bg-white/90">
            <CardContent>
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <p className="text-xl text-gray-600">No photos yet.</p>
              <p className="text-gray-500 mt-2">
                Check back soon for amazing event photos!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image._id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.3 } }}
                onClick={() => setSelectedImage(image)}
              >
                <Card className="overflow-hidden p-2 rounded-2xl shadow-lg shadow-blue-400 transition-all duration-300">
                  <div className="relative">
                    <motion.img
                      src={image.imageUrl}
                      alt={image.title || "Gallery image"}
                      className="w-full h-56 object-cover transition-transform rounded-lg"
                      whileHover={{ scale: 1.08 }}
                    />
                    <div className="absolute top-3 right-3 bg-blue-500 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(image.createdAt)}
                    </div>
                  </div>
                  <CardContent className="p-4 -mt-2">
                    <h3 className="text-lg font-semibold text-blue-600 mb-1 line-clamp-2">
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className="text-gray-800 font-bold text-sm line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      
      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-6 text-center bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-3xl text-white mb-3">{selectedImage.title}</h2>
              {selectedImage.description && (
                <p className="text-gray-400 text-lg mb-4">{selectedImage.description}</p>
              )}
              <div className="flex items-center justify-center gap-2 text-blue-200">
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
