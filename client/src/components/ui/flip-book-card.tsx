import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Book } from "@shared/schema";
import { Eye, ShoppingCart, Bookmark, Tag, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";

interface FlipBookCardProps {
  book: Book;
}

export function FlipBookCard({ book }: FlipBookCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  let cartItems: { bookId: number }[] = [];
  let addToCart = (bookId: number) => {};
  
  try {
    const cart = useCart();
    cartItems = cart.cartItems || [];
    addToCart = cart.addToCart;
  } catch (error) {
    console.error("Failed to access cart:", error);
  }

  const isInCart = cartItems.some(item => item.bookId === book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book.id);
  };

  const toggleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };
  
  // Determine condition badge color
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Like New":
        return "bg-yellow-400 text-yellow-900";
      case "Very Good":
        return "bg-green-500 text-white";
      case "Good":
        return "bg-blue-500 text-white";
      case "Acceptable":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Link href={`/books/${book.id}`}>
      <div className="relative h-full perspective-1000 cursor-pointer">
        <motion.div
          className="relative w-full h-full rounded-lg shadow-md transition-all duration-500"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card */}
          <div 
            className={`absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden ${isFlipped ? 'pointer-events-none' : ''}`} 
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="relative h-full flex flex-col">
              <div className="relative pt-[140%]">
                <img 
                  src={book.imageUrl} 
                  alt={`${book.title} cover`} 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-0 left-0 right-0 p-3 flex justify-between">
                  <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                    {book.category}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`${getConditionColor(book.condition)} border-0`}
                  >
                    {book.condition}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-3 right-3 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-md"
                  onClick={toggleFlip}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </div>
              <div className="p-4 bg-white flex-1 flex flex-col">
                <h3 className="font-serif font-bold text-gray-900 line-clamp-1 mb-1">{book.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{book.author}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-primary">${book.price.toFixed(2)}</span>
                  <Button 
                    variant={isInCart ? "secondary" : "default"}
                    size="sm"
                    className="rounded-full"
                    onClick={handleAddToCart}
                    disabled={isInCart}
                  >
                    {isInCart ? (
                      <>
                        <Bookmark className="mr-1.5 h-3.5 w-3.5" />
                        <span>In Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back of card */}
          <div 
            className={`absolute inset-0 w-full h-full bg-white backface-hidden rounded-lg shadow-md p-4 flex flex-col ${!isFlipped ? 'pointer-events-none' : ''}`} 
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)" 
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 rounded-full"
              onClick={toggleFlip}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to front</span>
            </Button>
            
            <h3 className="font-serif font-bold text-xl text-gray-900 mb-2 pr-6">{book.title}</h3>
            <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
            
            <div className="bg-primary/5 p-3 rounded-lg my-3">
              <p className="text-gray-700 text-sm line-clamp-5">{book.description}</p>
            </div>
            
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Format:</span>
                <span className="font-medium">{book.format}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Published:</span>
                <span className="font-medium">2020</span>
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span className="font-bold text-primary text-lg">${book.price.toFixed(2)}</span>
              <Button
                variant={isInCart ? "secondary" : "default"}
                size="sm"
                className="rounded-full"
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                {isInCart ? "In Cart" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}