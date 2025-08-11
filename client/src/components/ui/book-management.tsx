import { useState } from 'react';
import { Book } from '@shared/schema';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDown, Edit, Trash2, EyeOff, Tag, Clock, RefreshCw, 
  MoreHorizontal, AlertCircle, CheckCircle, BookMarked
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookManagementProps {
  userId: number;
}

export function BookManagement({ userId }: BookManagementProps) {
  const { toast } = useToast();
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmMarkSoldOpen, setConfirmMarkSoldOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);

  // Fetch user's books
  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ['/api/books', { sellerId: userId }],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/books', { sellerId: userId });
      const books = await response.json();
      // Only return books where this user is the seller
      return books.filter((book: Book) => book.sellerId === userId);
    },
  });

  // Filter books by status
  const availableBooks = books.filter(book => book.inStock !== false);
  const soldBooks = books.filter(book => book.inStock === false);

  // Delete book mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/books/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Book deleted",
        description: "The book has been successfully removed from your listings.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      setConfirmDeleteOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete book",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mark as sold mutation
  const markAsSoldMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('PUT', `/api/books/${id}`, { inStock: false });
    },
    onSuccess: () => {
      toast({
        title: "Book marked as sold",
        description: "The book has been marked as sold and removed from active listings.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      setConfirmMarkSoldOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to mark book as sold",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Republish book mutation (mark as available again)
  const republishMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('PUT', `/api/books/${id}`, { inStock: true });
    },
    onSuccess: () => {
      toast({
        title: "Book republished",
        description: "The book is now available for purchase.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to republish book",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle delete confirmation
  const handleDeleteBook = () => {
    if (selectedBookId) {
      deleteMutation.mutate(selectedBookId);
    }
  };

  // Handle marking as sold confirmation
  const handleMarkAsSold = () => {
    if (selectedBookId) {
      markAsSoldMutation.mutate(selectedBookId);
    }
  };

  // Book card component
  const BookCard = ({ book }: { book: Book }) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="bg-white rounded-lg shadow-md overflow-hidden flex border border-gray-100"
      >
        {/* Book image */}
        <div className="w-20 sm:w-28 flex-shrink-0">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Book details */}
        <div className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-serif font-bold text-gray-900 line-clamp-1">{book.title}</h3>
              <p className="text-gray-500 text-sm mb-1">{book.author}</p>
            </div>
            <div className="flex flex-shrink-0 ml-2">
              <Badge variant="outline" className={`
                ${book.inStock === false ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}
              `}>
                {book.inStock === false ? 'Sold' : 'Available'}
              </Badge>
            </div>
          </div>

          <div className="text-xs mt-1 flex items-center text-gray-500">
            <Tag className="h-3 w-3 mr-1" />
            {book.format} • {book.condition}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="font-semibold text-primary-600">${book.price.toFixed(2)}</div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>Listed {new Date(book.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-2 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedBookId(book.id);
                    setEditFormOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Listing
                </DropdownMenuItem>
                
                {book.inStock !== false ? (
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedBookId(book.id);
                      setConfirmMarkSoldOpen(true);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Sold
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => {
                      republishMutation.mutate(book.id);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Republish Listing
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => {
                    setSelectedBookId(book.id);
                    setConfirmDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Listing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
    );
  };

  // Empty state component
  const EmptyState = ({ type }: { type: 'active' | 'sold' }) => {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {type === 'active' ? (
            <BookMarked className="h-8 w-8 text-gray-400" />
          ) : (
            <EyeOff className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {type === 'active' ? 'No active listings' : 'No sold books yet'}
        </h3>
        <p className="text-gray-500 mb-4">
          {type === 'active'
            ? 'Start selling your books by creating a new listing'
            : 'Books marked as sold will appear here'}
        </p>
        {type === 'active' && (
          <Button asChild>
            <a href="#sell-form">Create Listing</a>
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900">Your Books</h2>
        <Button size="sm" className="gap-1 rounded-full" asChild>
          <a href="#sell-form">
            <span>Sell a Book</span>
            <ArrowDown className="h-4 w-4" />
          </a>
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="data-[state=active]:bg-primary/10">
            Active Listings ({availableBooks.length})
          </TabsTrigger>
          <TabsTrigger value="sold" className="data-[state=active]:bg-primary/10">
            Sold Books ({soldBooks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-2">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-3 border rounded-lg">
                  <Skeleton className="w-20 h-28" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-1/4 mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : availableBooks.length === 0 ? (
            <EmptyState type="active" />
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {availableBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </TabsContent>
        
        <TabsContent value="sold" className="pt-2">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-4 p-3 border rounded-lg">
                  <Skeleton className="w-20 h-28" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-1/4 mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : soldBooks.length === 0 ? (
            <EmptyState type="sold" />
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {soldBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span>Delete Book Listing</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this book listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBook}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Listing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Sold Confirmation Dialog */}
      <Dialog open={confirmMarkSoldOpen} onOpenChange={setConfirmMarkSoldOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Mark Book as Sold</span>
            </DialogTitle>
            <DialogDescription>
              This will mark the book as sold and remove it from active listings. You can republish it later if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmMarkSoldOpen(false)}
              disabled={markAsSoldMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMarkAsSold}
              disabled={markAsSoldMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {markAsSoldMutation.isPending ? "Processing..." : "Mark as Sold"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog - This would contain a form similar to the book creation form */}
      <Dialog open={editFormOpen} onOpenChange={setEditFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Book Listing</DialogTitle>
            <DialogDescription>
              Update the details of your book listing
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-sm text-gray-500">
              To edit your book listing, please use the form below.
            </p>
            <p className="text-center text-amber-600 mt-2">
              This feature is coming soon!
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setEditFormOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}