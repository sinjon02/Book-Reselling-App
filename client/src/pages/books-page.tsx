import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layouts/main-layout";
import { BookCard } from "@/components/ui/book-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Book, bookCategories, bookConditions, bookFormats } from "@shared/schema";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, Filter, SlidersHorizontal, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { queryClient } from "@/lib/queryClient";
import { SearchInput } from "@/components/ui/search-input";

export default function BooksPage() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(location.split('?')[1] || ''));
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.has('category') ? [searchParams.get('category')!] : []
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    searchParams.has('condition') ? [searchParams.get('condition')!] : []
  );
  const [selectedFormats, setSelectedFormats] = useState<string[]>(
    searchParams.has('format') ? [searchParams.get('format')!] : []
  );
  const [sellerRating, setSellerRating] = useState<string>(
    searchParams.get('rating') || ''
  );
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  // Build query params for API request
  const buildQueryParams = () => {
    const params: Record<string, string> = {};
    
    if (searchParams.has('search')) {
      params.search = searchParams.get('search')!;
    }

    if (selectedCategories.length > 0) {
      params.category = selectedCategories[0];
    }

    if (selectedConditions.length > 0) {
      params.condition = selectedConditions[0];
    }

    if (selectedFormats.length > 0) {
      params.format = selectedFormats[0];
    }

    if (priceRange.min) {
      params.minPrice = priceRange.min;
    }

    if (priceRange.max) {
      params.maxPrice = priceRange.max;
    }

    return params;
  };

  // Fetch books with filters
  const queryParams = buildQueryParams();
  const queryString = Object.keys(queryParams).length > 0 
    ? '?' + new URLSearchParams(queryParams).toString() 
    : '';
    
  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books' + queryString],
  });

  useEffect(() => {
    // Update search params from URL on initial load
    if (location.startsWith("/books") && location.includes("?")) {
      const params = new URLSearchParams(location.split("?")[1]);
      setSearchParams(params);
      
      if (params.has('category')) {
        setSelectedCategories([params.get('category')!]);
      }
      
      if (params.has('condition')) {
        setSelectedConditions([params.get('condition')!]);
      }
      
      if (params.has('format')) {
        setSelectedFormats([params.get('format')!]);
      }
      
      if (params.has('minPrice')) {
        setPriceRange(prev => ({ ...prev, min: params.get('minPrice')! }));
      }
      
      if (params.has('maxPrice')) {
        setPriceRange(prev => ({ ...prev, max: params.get('maxPrice')! }));
      }
    }
  }, [location]);

  // Handle pagination
  const totalPages = Math.ceil(books.length / booksPerPage);
  const currentBooks = books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  // Apply filters
  const handleApplyFilters = () => {
    // Reset to first page when filters change
    setCurrentPage(1);
    
    // Build URL parameters
    const newParams = new URLSearchParams();
    
    if (searchParams.has('search')) {
      newParams.set('search', searchParams.get('search')!);
    }
    
    if (selectedCategories.length > 0) {
      newParams.set('category', selectedCategories[0]);
    }
    
    if (selectedConditions.length > 0) {
      newParams.set('condition', selectedConditions[0]);
    }
    
    if (selectedFormats.length > 0) {
      newParams.set('format', selectedFormats[0]);
    }
    
    if (priceRange.min) {
      newParams.set('minPrice', priceRange.min);
    }
    
    if (priceRange.max) {
      newParams.set('maxPrice', priceRange.max);
    }
    
    // Update URL without reload
    const newUrl = newParams.toString() ? `/books?${newParams.toString()}` : '/books';
    window.history.pushState(null, '', newUrl);
    
    // Update search params state
    setSearchParams(newParams);
    
    // Force refetch with new parameters
    queryClient.invalidateQueries({ queryKey: ['/api/books'] });
  };

  // Filter components
  const FilterSection = () => (
    <>
      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range</h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="w-full p-2"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          />
          <span className="text-gray-500">-</span>
          <Input
            type="number"
            placeholder="Max"
            className="w-full p-2"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Category</h4>
        <div className="space-y-2">
          {bookCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category]);
                  } else {
                    setSelectedCategories(selectedCategories.filter(c => c !== category));
                  }
                }}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Condition</h4>
        <div className="space-y-2">
          {bookConditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={selectedConditions.includes(condition)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedConditions([...selectedConditions, condition]);
                  } else {
                    setSelectedConditions(selectedConditions.filter(c => c !== condition));
                  }
                }}
              />
              <Label htmlFor={`condition-${condition}`}>{condition}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Format</h4>
        <div className="space-y-2">
          {bookFormats.map((format) => (
            <div key={format} className="flex items-center space-x-2">
              <Checkbox
                id={`format-${format}`}
                checked={selectedFormats.includes(format)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedFormats([...selectedFormats, format]);
                  } else {
                    setSelectedFormats(selectedFormats.filter(f => f !== format));
                  }
                }}
              />
              <Label htmlFor={`format-${format}`}>{format}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        className="w-full bg-gray-800 hover:bg-gray-700" 
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
    </>
  );

  // Handle search
  const handleSearch = (searchTerm: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    
    // Update URL
    const newUrl = newParams.toString() ? `/books?${newParams.toString()}` : '/books';
    window.history.pushState(null, '', newUrl);
    
    // Update search params state
    setSearchParams(newParams);
    
    // Force refetch
    queryClient.invalidateQueries({ queryKey: ['/api/books'] });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse Books</h1>
        
        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <SearchInput onSearch={handleSearch} />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <h3 className="font-medium text-xl mb-4">Filters</h3>
              <FilterSection />
            </SheetContent>
          </Sheet>

          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block md:w-1/4 lg:w-1/5">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <div className="md:sticky md:top-24">
                <h3 className="font-medium text-xl mb-4">Filters</h3>
                <FilterSection />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:w-3/4 lg:w-4/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                {searchParams.has('search') 
                  ? `Search Results: "${searchParams.get('search')}"`
                  : "All Books"}
              </h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-gray-600 text-sm">Sort by:</Label>
                <select 
                  id="sort"
                  className="border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm"
                >
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Best Selling</option>
                </select>
              </div>
            </div>

            {/* Book Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="aspect-[2/3] rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-xl font-serif font-medium mb-2">No books found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search term to find what you're looking for.</p>
                <Button asChild>
                  <a href="/books">Clear All Filters</a>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <nav className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="h-9 w-9 p-0"
                        >
                          {page}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
