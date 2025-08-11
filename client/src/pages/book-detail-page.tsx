import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Book } from "@shared/schema";
import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Star, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookCard } from "@/components/ui/book-card";
import { getQueryFn } from "@/lib/queryClient";

export default function BookDetailPage() {
  const { id } = useParams();
  const bookId = parseInt(id || "0");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get cart data with error handling
  let cartItems: { bookId: number; quantity: number; id: number }[] = [];
  let addToCart = (bookId: number, quantity: number = 1) => {};
  
  try {
    const cart = useCart(); 
    cartItems = cart.cartItems || [];
    addToCart = cart.addToCart;
  } catch (error) {
    console.error("Failed to access cart:", error);
  }
  
  // Safely check if book is already in cart
  const isInCart = Array.isArray(cartItems) && cartItems.some(item => item.bookId === bookId);

  // Fetch book details
  const { data: book, isLoading: isLoadingBook } = useQuery<Book>({
    queryKey: [`/api/books/${bookId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!bookId,
  });

  // Fetch related books (same category)
  const { data: relatedBooks = [], isLoading: isLoadingRelated } = useQuery<Book[]>({
    queryKey: ['/api/books', book?.category],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!book,
  });

  // Filter out current book and limit to 4 related books
  const filteredRelatedBooks = relatedBooks
    .filter(relatedBook => relatedBook.id !== bookId)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(bookId, quantity);
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
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button variant="ghost" asChild className="flex items-center gap-1">
            <Link href="/books">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Books</span>
            </Link>
          </Button>
        </div>

        {isLoadingBook ? (
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            </div>
            <div className="md:w-2/3 space-y-4">
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-6 w-2/5" />
              <Skeleton className="h-6 w-1/5" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
              <div className="pt-4">
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
        ) : book ? (
          <div className="flex flex-col md:flex-row gap-10">
            {/* Book Image Gallery */}
            <div className="md:w-1/3">
              <div className="sticky top-24">
                <div className="relative">
                  {/* Main image display */}
                  <img 
                    src={currentImageIndex === 0 ? book.imageUrl : book.additionalImages?.[currentImageIndex - 1]} 
                    alt={`${book.title} cover`}
                    className="w-full rounded-lg shadow-md aspect-[2/3] object-cover" 
                  />
                  
                  {/* Condition badge */}
                  <div className={`absolute top-4 right-4 ${getConditionColor(book.condition)} px-3 py-1 rounded-full text-sm font-medium`}>
                    {book.condition}
                  </div>
                  
                  {/* Navigation arrows - only show if there are multiple images */}
                  {book.additionalImages && book.additionalImages.length > 0 && (
                    <>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={() => setCurrentImageIndex(prev => (prev === 0 ? (book.additionalImages?.length || 0) : prev - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={() => setCurrentImageIndex(prev => (prev === (book.additionalImages?.length || 0) ? 0 : prev + 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail images */}
                {book.additionalImages && book.additionalImages.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    <button 
                      className={`flex-1 p-1 border rounded ${currentImageIndex === 0 ? 'border-primary-500' : 'border-gray-200'}`}
                      onClick={() => setCurrentImageIndex(0)}
                    >
                      <img 
                        src={book.imageUrl} 
                        alt={`${book.title} thumbnail`}
                        className="aspect-[2/3] object-cover w-full" 
                      />
                    </button>
                    {book.additionalImages.map((imgUrl, index) => (
                      <button 
                        key={index}
                        className={`flex-1 p-1 border rounded ${currentImageIndex === index + 1 ? 'border-primary-500' : 'border-gray-200'}`}
                        onClick={() => setCurrentImageIndex(index + 1)}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`${book.title} additional image ${index + 1}`}
                          className="aspect-[2/3] object-cover w-full" 
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Book Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Format:</div>
                    <div>{book.format}</div>
                    <div className="text-gray-600">Category:</div>
                    <div>{book.category}</div>
                    <div className="text-gray-600">Condition:</div>
                    <div>{book.condition}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Details */}
            <div className="md:w-2/3">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">(50+ reviews)</span>
              </div>

              <div className="text-2xl font-bold text-primary-600 mb-6">${book.price.toFixed(2)}</div>

              <div className="prose prose-gray mb-8">
                <h3 className="text-lg font-serif font-bold">Description</h3>
                <p>{book.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Quantity selector */}
                <div className="flex items-center">
                  <Button 
                    variant="outline"
                    size="icon"
                    className="rounded-r-none"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <div className="px-4 py-2 border-y border-x-0 border-input h-10 min-w-[50px] flex items-center justify-center">
                    {quantity}
                  </div>
                  <Button 
                    variant="outline"
                    size="icon"
                    className="rounded-l-none"
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </Button>
                </div>

                {/* Add to cart button */}
                <Button 
                  className="flex-1 sm:flex-none sm:min-w-[200px]"
                  onClick={handleAddToCart}
                  disabled={isInCart}
                >
                  {isInCart ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>

              {/* Shipping info */}
              <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-8">
                <p className="font-medium">Free shipping on orders over $35</p>
              </div>

              {/* Seller info */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-2">Seller Information</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                    S
                  </div>
                  <div>
                    <p className="font-medium">Bibliboo Verified Seller</p>
                    <p className="text-sm text-gray-500">Member since January 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Book not found</h2>
            <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/books">Browse All Books</Link>
            </Button>
          </div>
        )}

        {/* Related Books */}
        {book && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            
            {isLoadingRelated ? (
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
            ) : filteredRelatedBooks.length === 0 ? (
              <p className="text-gray-500">No related books found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRelatedBooks.map((relatedBook) => (
                  <BookCard key={relatedBook.id} book={relatedBook} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
