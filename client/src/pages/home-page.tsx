import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CategoryCard } from "@/components/ui/category-card";
import { BookCard } from "@/components/ui/book-card";
import { useQuery } from "@tanstack/react-query";
import { Book } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { BookRecommendationCarousel } from "@/components/ui/book-recommendation-carousel";
import { 
  BookOpen, Recycle, ShieldCheck, ChevronRight, 
  ArrowRight, Star, Sparkles, TrendingUp, Globe
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function HomePage() {
  // Mouse animation for hero image
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageRef, setImageRef] = useState<HTMLElement | null>(null);
  
  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform motion values to rotation degrees
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef) return;
    
    // Get the bounds of the image element
    const rect = imageRef.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the image
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Update motion values based on mouse position
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
    
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleMouseLeave = () => {
    // Reset position when mouse leaves
    x.set(0);
    y.set(0);
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom = 0) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: custom * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const cardHover = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 400, damping: 17 }
    }
  };

  const buttonAnimation = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const scrollRef = useRef(null);

  // Fetch featured books
  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books'],
  });

  const featuredBooks = books.slice(0, 4);

  // Category definitions with enhanced icons
  const categories = [
    { name: "Fiction", icon: "book", color: "bg-blue-500" },
    { name: "Non-Fiction", icon: "compass", color: "bg-green-500" },
    { name: "Fantasy", icon: "magic", color: "bg-purple-500" },
    { name: "Sci-Fi", icon: "robot", color: "bg-indigo-500" },
    { name: "Romance", icon: "heart", color: "bg-pink-500" },
    { name: "View All", icon: "more", color: "bg-amber-500" }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-12 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-6"
              >
                <motion.h1 
                  className="font-serif text-4xl md:text-6xl font-bold text-gray-900 mb-2"
                  variants={fadeIn}
                  custom={0}
                >
                  <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">Discover</span> Books With Character
                </motion.h1>
                <motion.p 
                  className="text-gray-600 text-lg leading-relaxed mb-8"
                  variants={fadeIn}
                  custom={1}
                >
                  Buy and sell pre-loved books at a fraction of the cost while reducing waste and sharing stories that deserve to be read again.
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  variants={fadeIn}
                  custom={2}
                >
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonAnimation}
                  >
                    <Button asChild size="lg" className="rounded-full px-8 shadow-lg bg-primary hover:bg-primary/90 text-white">
                      <Link href="/books" className="group">
                        <span>Browse Books</span>
                        <ChevronRight className="ml-2 h-4 w-4 inline-block transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonAnimation}
                  >
                    <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 text-primary px-8">
                      <Link href="/profile">Sell Your Books</Link>
                    </Button>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="flex flex-wrap gap-6 pt-6"
                  variants={fadeIn}
                  custom={3}
                >
                  {[
                    { count: '10K+', label: 'Books Sold', icon: <TrendingUp className="h-4 w-4 text-primary" /> },
                    { count: '5K+', label: 'Happy Readers', icon: <Star className="h-4 w-4 text-amber-500" /> },
                    { count: '15+', label: 'Countries', icon: <Globe className="h-4 w-4 text-emerald-500" /> }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center">
                      <div className="bg-white shadow-sm rounded-lg p-2.5 mr-3">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="font-bold text-xl">{stat.count}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.7, 
                  type: "spring",
                  stiffness: 100
                }}
                className="relative"
              >
                <motion.div 
                  className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white perspective-1000"
                  ref={setImageRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transformStyle: "preserve-3d",
                    rotateX,
                    rotateY,
                  }}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 15 
                  }}
                >
                  <motion.div 
                    className="relative"
                    style={{ 
                      transformStyle: "preserve-3d",
                      transform: "translateZ(20px)"
                    }}
                  >
                    <motion.img 
                      src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
                      alt="Stack of books" 
                      className="rounded-lg max-h-96 w-full object-cover" 
                      initial={{ scale: 1.01 }}
                      animate={{ 
                        scale: 1.01,
                        transition: { 
                          duration: 0.5,
                          ease: "easeInOut" 
                        } 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Interactive light reflection effect */}
                    <motion.div
                      className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`,
                        mixBlendMode: "overlay"
                      }}
                    />
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-xl border border-gray-100 float-animation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  whileHover={{ y: -5, x: 5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                      <Recycle className="h-5 w-5" />
                    </div>
                    <p className="font-medium text-gray-800">10,000+ books have found new homes!</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute -top-5 -left-5 bg-white p-3 rounded-full shadow-xl float-animation"
                  initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  whileHover={{ rotate: 15 }}
                  style={{ animationDelay: "2s" }}
                >
                  <div className="flex items-center justify-center h-12 w-12 bg-primary/10 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div 
            className="flex justify-between items-center mb-10"
            variants={fadeIn}
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <Link href="/books" className="text-primary hover:text-primary-600 flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6"
            variants={staggerContainer}
          >
            {categories.map((category, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                custom={index}
              >
                <CategoryCard category={category.name} icon={category.icon} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-gray-50" ref={scrollRef}>
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div 
            className="flex justify-between items-center mb-10"
            variants={fadeIn}
          >
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
              Featured Books
            </h2>
            <Link href="/books" className="text-primary hover:text-primary-600 flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
            >
              {featuredBooks.map((book, index) => (
                <motion.div 
                  key={book.id}
                  variants={fadeIn}
                  custom={index}
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            className="mt-10 text-center"
            variants={fadeIn}
            custom={5}
          >
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonAnimation}
            >
              <Button asChild size="lg" className="rounded-full px-8 bg-primary/90 hover:bg-primary shadow-md group">
                <Link href="/books">
                  <span>View All Books</span>
                  <ArrowRight className="ml-2 h-4 w-4 inline-block transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Book Recommendations Carousel */}
      <BookRecommendationCarousel 
        title="Recommended for You" 
        subtitle="Personalized recommendations based on your interests"
        filter={{ condition: "Like New" }}
      />
      
      {/* Feature Highlights */}
      <section className="py-20 bg-white overflow-hidden">
        <motion.div 
          className="container mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
          >
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary">BookHaven</span>
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              BookHaven makes buying and selling used books simple, sustainable, and rewarding.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
            {[
              {
                icon: <BookOpen className="h-10 w-10 text-white" />,
                title: "Great Prices",
                description: "Find great deals on used books with prices up to 70% off retail. Save money while enjoying the same stories.",
                color: "bg-gradient-to-br from-blue-500 to-primary"
              },
              {
                icon: <Recycle className="h-10 w-10 text-white" />,
                title: "Eco-Friendly",
                description: "Support sustainable practices by giving books a second life and reducing waste. Good for your wallet and the planet.",
                color: "bg-gradient-to-br from-green-500 to-emerald-600"
              },
              {
                icon: <ShieldCheck className="h-10 w-10 text-white" />,
                title: "Trusted Community",
                description: "Our verification system and detailed condition descriptions ensure you know exactly what you're getting.",
                color: "bg-gradient-to-br from-amber-500 to-orange-600"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                custom={index}
                whileHover="hover"
                initial="rest"
                className="rounded-xl shadow-lg overflow-hidden"
              >
                <div className="flex flex-col h-full">
                  <div className={`p-6 ${feature.color}`}>
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-white mb-2">{feature.title}</h3>
                  </div>
                  <div className="p-6 bg-white flex-1">
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-600"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <motion.div 
          className="container mx-auto px-4 text-center relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="font-serif text-3xl md:text-5xl font-bold mb-6 text-white"
            variants={fadeIn}
            custom={0}
          >
            Ready to Sell Your Books?
          </motion.h2>
          
          <motion.p 
            className="text-white/90 text-lg max-w-2xl mx-auto mb-10"
            variants={fadeIn}
            custom={1}
          >
            Turn your unused books into cash and share your stories with others who will cherish them. 
            Easy listing, secure payment, and hassle-free shipping.
          </motion.p>
          
          <motion.div
            variants={fadeIn}
            custom={2}
          >
            <Button 
              asChild 
              variant="secondary" 
              size="lg" 
              className="rounded-full px-10 py-6 shadow-xl bg-white hover:bg-gray-50 text-primary text-lg"
            >
              <Link href="/profile" className="group">
                <span>Start Selling</span>
                <ArrowRight className="ml-2 h-5 w-5 inline-block transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </MainLayout>
  );
}
