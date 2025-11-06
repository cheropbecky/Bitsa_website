import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Calendar } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Simulate fetching static image data (no Supabase)
    setTimeout(() => {
      setImages([
        {
          id: 1,
          title: "BITSA Hackathon 2024",
          description: "A fun day of coding, teamwork, and innovation.",
          imageUrl: "/assets/gallery1.jpg",
          uploadedAt: "2024-03-15",
        },
        {
          id: 2,
          title: "Tech Talk with Alumni",
          description: "Inspiring stories and mentorship from BITSA alumni.",
          imageUrl: "/assets/gallery2.jpg",
          uploadedAt: "2024-05-02",
        },
        {
          id: 3,
          title: "Annual Dinner Night",
          description: "Celebrating achievements with friends and faculty.",
          imageUrl: "/assets/gallery3.jpg",
          uploadedAt: "2024-08-20",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm mb-4">
            Our Gallery
          </div>
          <h1 className="text-5xl md:text-6xl mb-4 text-gray-900">
            Event <span className="text-gradient-blue">Highlights</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Relive the memorable moments from our events and activities
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <Card className="text-center p-12 shadow-blue-lg border-blue-100 bg-white">
            <CardContent>
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <p className="text-xl text-gray-600">No photos yet.</p>
              <p className="text-gray-500 mt-2">
                Check back soon for amazing event photos!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-blue-xl transition-all duration-300 hover:-translate-y-2"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white mb-1 line-clamp-2">{image.title}</h3>
                  {image.description && (
                    <p className="text-white/80 text-sm line-clamp-2">
                      {image.description}
                    </p>
                  )}
                </div>

                {/* Corner Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gray-700">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {formatDate(image.uploadedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />

            <div className="mt-6 text-center bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-3xl text-white mb-3">
                {selectedImage.title}
              </h2>
              {selectedImage.description && (
                <p className="text-blue-100 text-lg mb-4">
                  {selectedImage.description}
                </p>
              )}
              <div className="flex items-center justify-center gap-2 text-blue-200">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(selectedImage.uploadedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
