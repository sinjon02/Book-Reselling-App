import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/ui/cart-drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, X, Search, User, ShoppingCart, LogOut, BookOpen, Home, 
  Package, Info, LayoutGrid, ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { SearchInput } from "@/components/ui/search-input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: ReactNode;
}

function HeaderContent() {
  const [location, navigate] = useLocation();
  let user = null;
  let logoutMutation = { mutate: () => {} };
  
  try {
    // Try to use auth, but don't crash if it's not available yet
    const auth = useAuth();
    user = auth.user;
    logoutMutation = auth.logoutMutation;
  } catch (error) {
    console.log("Auth not available yet");
  }
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  let cartCount = 0;
  
  try {
    // Try to use cart hook, but don't crash if it's not available
    const cart = useCart();
    cartCount = cart.cartCount;
  } catch (error) {
    console.log("Cart not available yet");
  }

  const handleSearch = (searchTerm: string) => {
    navigate(`/books?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 mr-10">
        <Link href="/" className="flex items-center text-primary">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="text-primary"
          >
            <path 
              d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6ZM7 7.5C7 7.22386 7.22386 7 7.5 7H11.5C11.7761 7 12 7.22386 12 7.5V16.5C12 16.7761 11.7761 17 11.5 17H7.5C7.22386 17 7 16.7761 7 16.5V7.5ZM13 7.5C13 7.22386 13.2239 7 13.5 7H16.5C16.7761 7 17 7.22386 17 7.5V12.5C17 12.7761 16.7761 13 16.5 13H13.5C13.2239 13 13 12.7761 13 12.5V7.5Z" 
              fill="currentColor"
            />
            <circle cx="15" cy="15" r="2" fill="currentColor" />
          </svg>
          <span className="font-serif font-bold text-xl ml-2">Bibliboo</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/">
          <span className={`text-gray-700 hover:text-primary font-medium ${location === '/' ? 'text-primary' : ''}`}>
            Home
          </span>
        </Link>
        <Link href="/books">
          <span className={`text-gray-700 hover:text-primary font-medium ${location.startsWith('/books') ? 'text-primary' : ''}`}>
            Books
          </span>
        </Link>
        <Link href="/profile">
          <span className={`text-gray-700 hover:text-primary font-medium ${location === '/profile' ? 'text-primary' : ''}`}>
            Sell Books
          </span>
        </Link>
        <Link href="/community">
          <span className={`text-gray-700 hover:text-primary font-medium ${location === '/community' ? 'text-primary' : ''}`}>
            Community
          </span>
        </Link>
      </nav>

      {/* Empty div to maintain layout balance */}
      <div className="hidden md:block flex-1 min-w-[50px]"></div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* Search - Mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="pt-10">
            <SearchInput 
              onSearch={(term) => {
                navigate(`/books?search=${encodeURIComponent(term)}`);
              }} 
              autoFocus
            />
          </SheetContent>
        </Sheet>

        {/* User Account */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1">
              <User className="h-5 w-5" />
              <span className="hidden md:block">Account</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user ? (
              <>
                <DropdownMenuLabel>Hi, {user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer">Selling Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 cursor-pointer"
                  onClick={() => logoutMutation.mutate()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/auth" className="w-full cursor-pointer">Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth" className="w-full cursor-pointer">Register</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Cart */}
        <Button 
          variant="ghost" 
          className="relative flex items-center gap-1"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="hidden md:block">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
        <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="text-primary"
                  >
                    <path 
                      d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6ZM7 7.5C7 7.22386 7.22386 7 7.5 7H11.5C11.7761 7 12 7.22386 12 7.5V16.5C12 16.7761 11.7761 17 11.5 17H7.5C7.22386 17 7 16.7761 7 16.5V7.5ZM13 7.5C13 7.22386 13.2239 7 13.5 7H16.5C16.7761 7 17 7.22386 17 7.5V12.5C17 12.7761 16.7761 13 16.5 13H13.5C13.2239 13 13 12.7761 13 12.5V7.5Z" 
                      fill="currentColor"
                    />
                    <circle cx="15" cy="15" r="2" fill="currentColor" />
                  </svg>
                  <span className="font-serif font-bold text-xl">Bibliboo</span>
                </div>
              </div>

              <nav className="py-6 flex-1">
                <ul className="space-y-2">
                  <li>
                    <Link href="/">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <span>
                          <Home className="mr-2 h-5 w-5" />
                          Home
                        </span>
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/books">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <span>
                          <LayoutGrid className="mr-2 h-5 w-5" />
                          Books
                        </span>
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <span>
                          <Package className="mr-2 h-5 w-5" />
                          Sell Books
                        </span>
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/community">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="mr-2 h-5 w-5" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                          </svg>
                          Community
                        </span>
                      </Button>
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="border-t pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                        {user.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="w-full mt-2"
                      onClick={() => logoutMutation.mutate()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button asChild>
                      <Link href="/auth">Sign In</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/auth">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <HeaderContent />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div>
              <div className="flex items-center gap-2 mb-4 group">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="text-primary group-hover:rotate-12 transition-transform duration-300"
                >
                  <path 
                    d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6ZM7 7.5C7 7.22386 7.22386 7 7.5 7H11.5C11.7761 7 12 7.22386 12 7.5V16.5C12 16.7761 11.7761 17 11.5 17H7.5C7.22386 17 7 16.7761 7 16.5V7.5ZM13 7.5C13 7.22386 13.2239 7 13.5 7H16.5C16.7761 7 17 7.22386 17 7.5V12.5C17 12.7761 16.7761 13 16.5 13H13.5C13.2239 13 13 12.7761 13 12.5V7.5Z" 
                    fill="currentColor"
                  />
                  <circle cx="15" cy="15" r="2" fill="currentColor" />
                </svg>
                <span className="font-serif font-bold text-xl text-white bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                  Bibliboo
                </span>
              </div>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Buy and sell pre-loved books at a fraction of the cost while reducing waste and sharing stories. Our mission is to give books a second life.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Column 2 */}
            <div>
              <h3 className="text-white font-medium text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { href: "/", label: "Home" },
                  { href: "/books", label: "Browse Books" },
                  { href: "/profile", label: "Sell Books" },
                  { href: "/community", label: "Community" },
                  { href: "#", label: "Contact" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="hover:text-white transition-colors duration-200 group flex items-center"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 3 */}
            <div>
              <h3 className="text-white font-medium text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                {[
                  { href: "/books?category=Fiction", label: "Fiction" },
                  { href: "/books?category=Non-Fiction", label: "Non-Fiction" },
                  { href: "/books?category=Fantasy", label: "Fantasy" },
                  { href: "/books?category=Sci-Fi", label: "Sci-Fi" },
                  { href: "/books?category=Romance", label: "Romance" },
                  { href: "/books", label: "All Categories" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link 
                      href={link.href} 
                      className="hover:text-white transition-colors duration-200 group flex items-center"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 4 */}
            <div>
              <h3 className="text-white font-medium text-lg mb-4">Newsletter</h3>
              <p className="mb-4 text-gray-400">Subscribe to get updates on new arrivals and special promotions</p>
              <form className="flex flex-col space-y-2">
                <div className="relative">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    className="bg-gray-800 border-gray-700 text-white focus:border-primary pr-12 transition-all duration-300"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    @
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-600 transition-colors duration-300 rounded-full"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} Bibliboo. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 md:mt-0">
              {["Terms of Service", "Privacy Policy", "Accessibility"].map((item, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="text-gray-500 hover:text-white transition-colors duration-200 text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}