import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import { Minus, Plus, X, Tag, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Book } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define the CartItem type locally
interface CartItem {
  id: number;
  userId: number;
  bookId: number;
  quantity: number;
  book: Book;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  // Safely get cart data with proper error handling
  let cartItems: CartItem[] = [];
  let updateQuantity = (id: number, quantity: number) => {};
  let removeFromCart = (id: number) => {};
  let cartTotal = 0;
  let cartCount = 0;
  let isLoading = false;
  let user: {id: number; name?: string; email?: string;} | null = null;
  
  try {
    const cart = useCart();
    cartItems = cart.cartItems || [];
    updateQuantity = cart.updateQuantity;
    removeFromCart = cart.removeFromCart;
    cartTotal = cart.cartTotal;
    cartCount = cart.cartCount;
    isLoading = cart.isLoading;
  } catch (error) {
    console.error("Failed to access cart:", error);
  }
  
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.error("Failed to access auth:", error);
  }

  const shipping = 4.99;
  const total = cartTotal + shipping;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 grid w-[92vw] max-w-md max-h-[80vh] translate-x-[-50%] translate-y-[-50%] gap-0 border border-gray-200 bg-white p-0 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl flex flex-col overflow-hidden"
        >
          {/* Header Section - Fixed Height */}
          <motion.div 
            className="py-3 px-4 border-b flex items-center justify-between bg-white z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-medium flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
              <span>Your Cart</span>
              <Badge variant="outline" className="ml-2 bg-primary/10">
                {cartCount}
              </Badge>
            </h2>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogPrimitive.Close>
          </motion.div>

          {/* Content Section */}
          {cartItems.length === 0 ? (
            <motion.div 
              className="flex-1 flex flex-col items-center justify-center p-8 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <ShoppingBag className="h-12 w-12 text-primary/50" />
              </motion.div>
              <div className="text-center">
                <h3 className="font-medium text-lg">Your cart is empty</h3>
                <p className="text-gray-500 mb-6 mt-1">Start adding books to your cart</p>
              </div>
              <DialogPrimitive.Close asChild>
                <Button asChild className="px-8 rounded-full">
                  <Link href="/books">Browse Books</Link>
                </Button>
              </DialogPrimitive.Close>
            </motion.div>
          ) : (
            <>
              {/* Cart Items - Fixed Height with Scrolling */}
              <div className="overflow-y-auto h-[40vh] md:h-[45vh]">
                <div className="px-4 py-3 space-y-3">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id} 
                        className="flex gap-3 pb-3 border-b last:border-b-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
                        transition={{ type: "spring", damping: 25 }}
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.01)' }}
                      >
                        <div className="relative flex-shrink-0">
                          <img 
                            src={item.book.imageUrl} 
                            alt={`${item.book.title} cover`} 
                            className="w-16 h-24 object-cover rounded-md shadow-md"
                          />
                          <Badge 
                            variant="secondary" 
                            className="absolute -top-2 -right-2 text-xs bg-primary/10 text-primary"
                          >
                            {item.book.category}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0"> {/* min-width prevents flex items from shrinking too much */}
                          <h3 className="font-serif font-medium line-clamp-2">{item.book.title}</h3>
                          <p className="text-gray-500 text-sm">{item.book.author}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center">
                            <Tag className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.book.format} • {item.book.condition}</span>
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-primary font-semibold">${item.book.price.toFixed(2)}</span>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-7 w-7 rounded-full p-0 border-primary/20"
                                onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <motion.span 
                                key={item.quantity}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="w-6 text-center font-medium"
                              >
                                {item.quantity}
                              </motion.span>
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-7 w-7 rounded-full p-0 border-primary/20"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full flex-shrink-0 self-start mt-1"
                          onClick={() => removeFromCart(item.id)}
                          title="Remove from cart"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer Section - Fixed at Bottom */}
              <motion.div 
                className="p-4 border-t bg-gray-50 flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <motion.span 
                    key={cartTotal}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="font-medium"
                  >
                    ${cartTotal.toFixed(2)}
                  </motion.span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-semibold mb-4">
                  <span>Total</span>
                  <motion.span 
                    key={total}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    ${total.toFixed(2)}
                  </motion.span>
                </div>
                
                <DialogPrimitive.Close asChild>
                  <Button 
                    className="w-full relative overflow-hidden group rounded-full" 
                    asChild
                  >
                    <Link href={user ? "/checkout" : "/auth"}>
                      <span className="relative z-10">
                        {user ? "Checkout" : "Sign in to Checkout"}
                      </span>
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    </Link>
                  </Button>
                </DialogPrimitive.Close>
              </motion.div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
