import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Book } from "@shared/schema";
import { FlipBookCard } from "@/components/ui/flip-book-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BookRecommendationCarouselProps {
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  maxBooks?: number;
  filter?: {
    category?: string;
    condition?: string;
  };
}

export function BookRecommendationCarousel({
  title = "Recommended for You",
  subtitle,
  viewAllLink = "/books",
  maxBooks = 8,
  filter
}: BookRecommendationCarouselProps) {
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

  // Query for books with optional filtering
  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books', filter?.category, filter?.condition],
  });

  // Limit number of books
  const limitedBooks = books.slice(0, maxBooks);

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <motion.h2 
              className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h2>
            {subtitle && (
              <motion.p 
                className="text-gray-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          
          {viewAllLink && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ x: 5 }}
            >
              <Button variant="ghost" asChild className="gap-1 text-primary hover:text-primary-600 hover:bg-primary-50/50">
                <Link href={viewAllLink}>
                  <span>View all</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="aspect-[2/3] rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : limitedBooks.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or check back later</p>
            <Button asChild variant="outline">
              <Link href="/books">Browse All Books</Link>
            </Button>
          </div>
        ) : (
          <Carousel
            opts={{ 
              align: "start",
              loop: limitedBooks.length > 4,
            }}
            className="recommendation-carousel w-full relative px-4 md:-mx-6"
          >
            <div className="absolute left-0 md:-left-3 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-none"></div>
            
            <CarouselContent className="-ml-4 md:-ml-6">
              {limitedBooks.map((book, index) => (
                <CarouselItem key={book.id} className="pl-4 md:pl-6 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    custom={index * 0.15}
                    className="h-full"
                  >
                    <FlipBookCard book={book} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="absolute right-0 md:-right-3 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white via-white/95 to-transparent pointer-events-none"></div>
            
            <CarouselPrevious className="left-0 md:-left-12 z-20 shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" />
            <CarouselNext className="right-0 md:-right-12 z-20 shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" />
          </Carousel>
        )}
        
        {/* Trending label */}
        <motion.div
          className="flex items-center gap-2 mt-6 text-sm text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <TrendingUp className="h-4 w-4 text-primary" />
          <span>Updated daily based on popularity and your browsing history</span>
        </motion.div>
      </div>
    </div>
  );
}