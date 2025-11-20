import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import heroPicture from "../assets/hero_bitsa.jpg"; // background image
import api from '../api/api'; // Axios instance pointing to deployed backend

// --- Helper Component to Handle Image Loading Errors ---
const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  // NOTE: Assuming '/fallback-image.jpg' is a valid path in your public/assets
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc('/fallback-image.jpg')}
    />
  );
};

// --- New Component for the Full-Width Featured Hero Post ---
const FeaturedHeroPostCard = ({ post, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 group cursor-pointer"
        onClick={onClick}
    >
        <Card className="flex flex-col md:flex-row h-auto md:h-[400px] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-blue-500/50 border-4 border-blue-600 bg-white/90 backdrop-blur-sm">
            {/* Image (Takes 2/5 horizontal space on medium screens) */}
            <div className="relative w-full md:w-2/5 h-60 md:h-full overflow-hidden">
                <ImageWithFallback
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Content (Takes 3/5 horizontal space) */}
            <div className="flex flex-col justify-center w-full md:w-3/5 p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    {post.category && (
                        <Badge className="bg-blue-600 text-white text-sm font-bold px-3 py-1 uppercase">{post.category}</Badge>
                    )}
                    <span className="text-gray-500 text-sm">Featured Post</span>
                </div>

                <CardTitle className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 line-clamp-2 transition-colors group-hover:text-blue-700">
                    {post.title}
                </CardTitle>
                
                <CardDescription className="text-lg text-gray-700 mb-6 line-clamp-3">
                    {post.content}
                </CardDescription>

                {/* Metadata Row: Inherits your original Tailwind snippet style (flex, justify-between, text-sm, font-bold) */}
                <div className="flex items-center justify-between text-sm font-bold text-gray-700 mt-auto pt-4 border-t border-gray-200">
                    {post.author && (
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            <span>{post.author}</span>
                        </div>
                    )}
                    {post.createdAt && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    </motion.div>
);

// --- Component for the Two-Column Grid Posts ---
const GridPostCard = ({ post, onClick, formatDate }) => (
    <motion.div
        key={post._id || post.id}
        variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
        }}
    >
        <Card
            className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-2 border-gray-200 hover:border-blue-600 bg-white/90 backdrop-blur-sm"
            onClick={onClick}
        >
            {post.imageUrl && (
                <div className="relative h-60 overflow-hidden">
                    <ImageWithFallback
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                        {post.category && (
                            <Badge className="bg-blue-500 backdrop-blur-sm text-white px-3 py-1 text-sm font-semibold">
                                {post.category}
                            </Badge>
                        )}
                    </div>
                </div>
            )}
            <CardHeader>
                <CardTitle className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {post.title}
                </CardTitle>
                <CardDescription className="text-gray-600 line-clamp-3">
                    {post.content}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Your original Tailwind snippet styling */}
                <div className="flex items-center justify-between text-sm font-bold text-gray-700">
                    {post.author && (
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            <span>{post.author}</span>
                        </div>
                    )}
                    {post.createdAt && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>{formatDate(post.createdAt)}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

// --- Main Blogs Component ---
function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      // Ensure the blogs array is sorted, perhaps by date, to pick the latest as featured
      const sortedBlogs = (response.data.blogs || response.data || []).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '';

  // --- Single Blog View (No change needed here) ---
  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${heroPicture})` }}>
        {/* ... (Single Blog View code remains the same) ... */}
        <div className="bg-black/30 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Button
              onClick={() => setSelectedBlog(null)}
              variant="ghost"
              className="mb-8 text-white hover:text-blue-200 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all posts
            </Button>

            <motion.article
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm"
            >
              {selectedBlog.imageUrl && (
                <div className="relative h-96 overflow-hidden">
                  <ImageWithFallback src={selectedBlog.imageUrl} alt={selectedBlog.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-700">
                  {selectedBlog.category && (
                    <Badge className="bg-blue-100 text-blue-700 px-4 py-1">{selectedBlog.category}</Badge>
                  )}
                  {selectedBlog.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedBlog.createdAt)}</span>
                    </div>
                  )}
                  {selectedBlog.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedBlog.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>5 min read</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl mb-6 text-gray-900 leading-tight">{selectedBlog.title}</h1>

                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                  {selectedBlog.content?.split('\n').map((p, i) => (
                    <p key={i} className="mb-4">{p}</p>
                  ))}
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Blog List View (Updated for Modern Layout) ---
  const featuredPost = blogs[0]; // Assuming the first is the latest/featured
  const gridPosts = blogs.slice(1); // The rest go into the grid

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${heroPicture})` }}>
      <div className="bg-black/20 min-h-screen">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center pt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            Latest <span className="text-blue-200">Insights</span>
          </h1>
          <p className="text-xl font-bold text-gray-200 max-w-2xl mx-auto">
            Stay updated with the latest tech trends, tutorials, and stories from the BITSA community
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-200">Loading posts...</p>
            </div>
          ) : blogs.length === 0 ? (
            <Card className="text-center p-12 shadow-lg border-blue-100 bg-white/80 backdrop-blur-sm">
              <CardContent>
                <p className="text-xl text-gray-700">No blog posts available yet.</p>
                <p className="text-gray-600 font-bold mt-2">Check back soon for exciting content!</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* 1. Full-Width Featured Hero Post */}
              {featuredPost && (
                <FeaturedHeroPostCard 
                  post={featuredPost} 
                  onClick={() => setSelectedBlog(featuredPost)} 
                />
              )}

              {/* 2. Two-Column Grid for Remaining Posts */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8" /* KEY CHANGE: Removed lg:grid-cols-3 */
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {gridPosts.map((blog) => (
                  <GridPostCard 
                    key={blog._id || blog.id}
                    post={blog}
                    onClick={() => setSelectedBlog(blog)}
                    formatDate={formatDate}
                  />
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blogs;