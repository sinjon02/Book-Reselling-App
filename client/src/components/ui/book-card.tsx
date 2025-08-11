import { Book } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, BookOpen, Tag } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();
  const [isHovering, setIsHovering] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book.id);
  };

  // Determine condition badge color
  const conditionColor = {
    "Like New": "bg-yellow-400 text-yellow-900",
    "Very Good": "bg-green-500 text-white",
    "Good": "bg-blue-500 text-white",
    "Acceptable": "bg-orange-500 text-white",
  }[book.condition] || "bg-gray-500 text-white";

  // Determine category color theme
  const categoryColor = {
    "Fiction": "bg-blue-50 text-blue-600 border-blue-200",
    "Non-Fiction": "bg-emerald-50 text-emerald-600 border-emerald-200",
    "Fantasy": "bg-purple-50 text-purple-600 border-purple-200",
    "Sci-Fi": "bg-indigo-50 text-indigo-600 border-indigo-200",
    "Romance": "bg-pink-50 text-pink-600 border-pink-200",
    "Mystery": "bg-amber-50 text-amber-600 border-amber-200",
    "Children": "bg-yellow-50 text-yellow-600 border-yellow-200",
    "History": "bg-orange-50 text-orange-600 border-orange-200",
    "Biography": "bg-cyan-50 text-cyan-600 border-cyan-200",
    "Self-Help": "bg-lime-50 text-lime-600 border-lime-200",
  }[book.category] || "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <Card className="overflow-hidden group h-full flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-300">
        <Link href={`/books/${book.id}`}>
          <div className="relative aspect-[2/3] overflow-hidden">
            <motion.img 
              src={book.imageUrl} 
              alt={`${book.title} book cover`} 
              className="object-cover w-full h-full"
              animate={{ scale: isHovering ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${conditionColor}`}>
              {book.condition}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-white" />
                <p className="text-white text-sm">{book.format}</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex mb-2 gap-1 flex-wrap">
              <Badge 
                variant="outline" 
                className={`text-xs px-2 py-0.5 ${categoryColor}`}
              >
                {book.category}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200"
              >
                {book.format}
              </Badge>
            </div>
            <h3 className="font-serif font-bold text-lg mb-1 group-hover:text-primary line-clamp-2">{book.title}</h3>
            <p className="text-gray-600 mb-2">{book.author}</p>
            <div className="flex justify-between items-center mt-auto">
              <motion.span 
                className="text-primary font-semibold text-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                ${book.price.toFixed(2)}
              </motion.span>
              <Button 
                size="icon" 
                onClick={handleAddToCart}
                className="rounded-full relative overflow-hidden group"
              >
                <ShoppingCart className="h-5 w-5 relative z-10" />
                <motion.span 
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 2 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
}
