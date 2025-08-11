import { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Book, Order } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  BookOpen,
  User,
  ShoppingBag,
  Settings,
  LogOut,
  Loader2,
  Check,
  Truck,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/ui/book-card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookManagement } from "@/components/ui/book-management";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Book form schema
const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  condition: z.enum(["Like New", "Very Good", "Good", "Acceptable"]),
  format: z.enum(["Hardcover", "Paperback", "Boxed Set"]),
  category: z.enum([
    "Fiction",
    "Non-Fiction",
    "Fantasy",
    "Sci-Fi",
    "Romance",
    "Mystery",
    "Children",
    "History",
    "Biography",
    "Self-Help",
  ]),
  imageUrl: z.string().url("Please enter a valid image URL"),
  additionalImage1: z.string().url("Please enter a valid image URL").optional(),
  additionalImage2: z.string().url("Please enter a valid image URL").optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

// Status badge components
const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    Pending: "bg-yellow-400 text-yellow-900",
    Processing: "bg-blue-500 text-white",
    Shipped: "bg-green-500 text-white",
    Delivered: "bg-green-600 text-white",
    Cancelled: "bg-red-500 text-white",
  } as Record<string, string>;

  const statusClass = statusStyles[status as keyof typeof statusStyles] || "bg-gray-500";

  return (
    <Badge className={statusClass}>{status}</Badge>
  );
};

// Status icon components
const StatusIcon = ({ status }: { status: string }) => {
  const icons = {
    Pending: <Clock className="h-5 w-5 text-yellow-500" />,
    Processing: <Package className="h-5 w-5 text-blue-500" />,
    Shipped: <Truck className="h-5 w-5 text-green-500" />,
    Delivered: <Check className="h-5 w-5 text-green-600" />,
    Cancelled: <AlertCircle className="h-5 w-5 text-red-500" />,
  } as Record<string, JSX.Element>;

  return icons[status as keyof typeof icons] || <Clock className="h-5 w-5" />;
};

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  // Toggle order details
  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  // Fetch user's books
  const { 
    data: myBooks = [],
    isLoading: isLoadingBooks
  } = useQuery<Book[]>({
    queryKey: ['/api/books', { sellerId: user?.id }],
    enabled: !!user && activeTab === "myBooks",
  });

  // Fetch user's orders
  const {
    data: orders = [],
    isLoading: isLoadingOrders
  } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    enabled: !!user && activeTab === "orders",
  });

  // Book form setup
  const bookForm = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      price: 0,
      condition: "Like New",
      format: "Paperback",
      category: "Fiction",
      imageUrl: "",
      additionalImage1: "",
      additionalImage2: "",
    },
  });

  // Create book mutation
  const createBookMutation = useMutation({
    mutationFn: async (data: BookFormValues) => {
      // Filter out empty additional image fields and convert to array format
      const additionalImages = [];
      if (data.additionalImage1) additionalImages.push(data.additionalImage1);
      if (data.additionalImage2) additionalImages.push(data.additionalImage2);
      
      const response = await apiRequest("POST", "/api/books", {
        ...data,
        sellerId: user?.id,
        inStock: true,
        additionalImages: additionalImages.length > 0 ? additionalImages : undefined,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      toast({
        title: "Book listed successfully",
        description: "Your book has been added to the marketplace.",
      });
      bookForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to list book",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle book form submission
  const onBookFormSubmit = (data: BookFormValues) => {
    createBookMutation.mutate(data);
  };

  // Placeholder book data for suggestions
  const sampleBookData = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A novel of the Jazz Age that explores themes of decadence, idealism, and the American Dream.",
      price: 10.50,
      condition: "Like New",
      format: "Paperback",
      category: "Fiction",
      imageUrl: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?ixlib=rb-4.0.3",
      additionalImage1: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3",
      additionalImage2: "https://images.unsplash.com/photo-1585158531004-3224babed121?ixlib=rb-4.0.3"
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "A classic of modern American literature that explores themes of racial injustice and moral growth in the American South.",
      price: 12.99,
      condition: "Very Good",
      format: "Hardcover",
      category: "Fiction",
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3",
      additionalImage1: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3",
      additionalImage2: ""
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      description: "A science fiction novel set in the distant future amidst a feudal interstellar society where noble houses control planetary fiefs.",
      price: 14.75,
      condition: "Good",
      format: "Paperback",
      category: "Sci-Fi",
      imageUrl: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?ixlib=rb-4.0.3",
      additionalImage1: "https://images.unsplash.com/photo-1531072901544-238a0cb0c6c1?ixlib=rb-4.0.3",
      additionalImage2: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3"
    }
  ];

  // Fill form with sample book data
  const fillSampleData = (index: number) => {
    const sample = sampleBookData[index];
    bookForm.reset({
      ...sample,
      condition: sample.condition as any,
      format: sample.format as any,
      category: sample.category as any,
    });
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Please sign in to view your profile</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="md:w-1/4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-medium">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>

                <Separator className="mb-4" />

                <nav className="space-y-1">
                  <Button
                    variant={activeTab === "orders" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("orders")}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    My Orders
                  </Button>
                  <Button
                    variant={activeTab === "myBooks" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("myBooks")}
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    My Books
                  </Button>
                  <Button
                    variant={activeTab === "sellBook" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("sellBook")}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Sell a Book
                  </Button>
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Profile Details
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-5 w-5" />
                    )}
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="space-y-6">
              {/* Orders Tab */}
              {activeTab === "orders" && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>
                      View and manage your book purchases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingOrders ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <Card key={i}>
                            <CardContent className="p-4">
                              <div className="flex flex-col space-y-3">
                                <div className="flex justify-between">
                                  <Skeleton className="h-5 w-1/3" />
                                  <Skeleton className="h-5 w-20" />
                                </div>
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/5" />
                                <div className="flex justify-between">
                                  <Skeleton className="h-4 w-20" />
                                  <Skeleton className="h-4 w-20" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                        <p className="text-gray-500 mb-4">When you make purchases, they will appear here</p>
                        <Button asChild>
                          <a href="/books">Browse Books</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Collapsible
                            key={order.id}
                            open={expandedOrders.includes(order.id)}
                            onOpenChange={() => toggleOrderDetails(order.id)}
                          >
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-medium">Order #{order.id}</h3>
                                      <OrderStatusBadge status={order.status} />
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                    <StatusIcon status={order.status} />
                                    <span className="font-medium">${order.total.toFixed(2)}</span>
                                    <CollapsibleTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        {expandedOrders.includes(order.id) ? (
                                          <ChevronUp className="h-4 w-4" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </CollapsibleTrigger>
                                  </div>
                                </div>

                                <CollapsibleContent>
                                  <Separator className="mb-4" />
                                  <div className="space-y-4">
                                    {/* Order Items */}
                                    {(order as any).items?.map((item: any) => (
                                      <div key={item.id} className="flex gap-3">
                                        <img
                                          src={item.book.imageUrl}
                                          alt={item.book.title}
                                          className="w-16 h-24 object-cover rounded"
                                        />
                                        <div>
                                          <h4 className="font-medium">{item.book.title}</h4>
                                          <p className="text-gray-500 text-sm">{item.book.author}</p>
                                          <p className="text-sm">
                                            ${item.price.toFixed(2)} × {item.quantity}
                                          </p>
                                        </div>
                                      </div>
                                    ))}

                                    {/* Shipping Address */}
                                    <div className="bg-gray-50 p-3 rounded">
                                      <p className="font-medium mb-1">Shipping Address</p>
                                      <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </CardContent>
                            </Card>
                          </Collapsible>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* My Books Tab */}
              {activeTab === "myBooks" && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Books</CardTitle>
                    <CardDescription>
                      Books you are selling on Bibliboo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingBooks ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex flex-col space-y-3">
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
                    ) : myBooks.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No books listed yet</h3>
                        <p className="text-gray-500 mb-4">Start selling your books on Bibliboo</p>
                        <Button onClick={() => setActiveTab("sellBook")}>
                          List a Book
                        </Button>
                      </div>
                    ) : (
                      <BookManagement userId={user.id} />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Sell Book Tab */}
              {activeTab === "sellBook" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sell a Book</CardTitle>
                    <CardDescription>
                      List your book for sale on Bibliboo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...bookForm}>
                      <form onSubmit={bookForm.handleSubmit(onBookFormSubmit)} className="space-y-6">
                        {/* Demo helpers */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                          <h3 className="font-medium mb-2">Quick Fill (Demo)</h3>
                          <div className="flex flex-wrap gap-2">
                            {sampleBookData.map((book, index) => (
                              <Button 
                                key={index} 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => fillSampleData(index)}
                              >
                                {book.title}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          <FormField
                            control={bookForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Book Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter book title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={bookForm.control}
                            name="author"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter author name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={bookForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Provide a description of the book" 
                                    {...field}
                                    rows={4}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={bookForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price ($)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="0.01" 
                                      step="0.01" 
                                      placeholder="9.99" 
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={bookForm.control}
                              name="condition"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Condition</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Like New">Like New</SelectItem>
                                      <SelectItem value="Very Good">Very Good</SelectItem>
                                      <SelectItem value="Good">Good</SelectItem>
                                      <SelectItem value="Acceptable">Acceptable</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={bookForm.control}
                              name="format"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Format</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select format" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Hardcover">Hardcover</SelectItem>
                                      <SelectItem value="Paperback">Paperback</SelectItem>
                                      <SelectItem value="Boxed Set">Boxed Set</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={bookForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Fiction">Fiction</SelectItem>
                                      <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                                      <SelectItem value="Fantasy">Fantasy</SelectItem>
                                      <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                                      <SelectItem value="Romance">Romance</SelectItem>
                                      <SelectItem value="Mystery">Mystery</SelectItem>
                                      <SelectItem value="Children">Children</SelectItem>
                                      <SelectItem value="History">History</SelectItem>
                                      <SelectItem value="Biography">Biography</SelectItem>
                                      <SelectItem value="Self-Help">Self-Help</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={bookForm.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Book Cover Image (Primary)</FormLabel>
                                <FormControl>
                                  <div className="flex flex-col gap-2">
                                    <Input 
                                      type="file" 
                                      accept="image/*"
                                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
                                      onChange={(e) => {
                                        // This would normally upload to storage, but for now we'll use a URL
                                        // We're keeping the URL value for compatibility with the existing code
                                        if (e.target.files && e.target.files[0]) {
                                          // In a real implementation, this would be an upload function
                                          // Instead, we'll set a default URL
                                          field.onChange(`https://source.unsplash.com/random/300×300/?book&sig=${Date.now()}`);
                                        }
                                      }}
                                    />
                                    <p className="text-xs text-gray-500">Max file size: 2MB. Recommended dimensions: 600x900px</p>
                                    {field.value && (
                                      <div className="mt-2 border rounded p-2">
                                        <p className="text-xs text-gray-500 mb-1">Current image:</p>
                                        <img src={field.value} alt="Book cover preview" className="h-20 object-cover rounded" />
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="mt-6">
                            <h3 className="font-medium text-gray-800 mb-2">Additional Images (Optional)</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              You can add up to 2 additional images to showcase your book from different angles
                            </p>
                            
                            <div className="space-y-4">
                              <FormField
                                control={bookForm.control}
                                name="additionalImage1"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Additional Image 1</FormLabel>
                                    <FormControl>
                                      <div className="flex flex-col gap-2">
                                        <Input 
                                          type="file" 
                                          accept="image/*"
                                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
                                          onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                              // In a real implementation, this would be an upload function
                                              field.onChange(`https://source.unsplash.com/random/300×300/?book&sig=${Date.now()}-1`);
                                            }
                                          }}
                                        />
                                        {field.value && (
                                          <div className="mt-2 border rounded p-2">
                                            <p className="text-xs text-gray-500 mb-1">Current image:</p>
                                            <img src={field.value} alt="Additional image 1 preview" className="h-20 object-cover rounded" />
                                          </div>
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={bookForm.control}
                                name="additionalImage2"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Additional Image 2</FormLabel>
                                    <FormControl>
                                      <div className="flex flex-col gap-2">
                                        <Input 
                                          type="file" 
                                          accept="image/*"
                                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
                                          onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                              // In a real implementation, this would be an upload function
                                              field.onChange(`https://source.unsplash.com/random/300×300/?book&sig=${Date.now()}-2`);
                                            }
                                          }}
                                        />
                                        {field.value && (
                                          <div className="mt-2 border rounded p-2">
                                            <p className="text-xs text-gray-500 mb-1">Current image:</p>
                                            <img src={field.value} alt="Additional image 2 preview" className="h-20 object-cover rounded" />
                                          </div>
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <Button 
                            type="submit" 
                            disabled={createBookMutation.isPending}
                            className="w-full"
                          >
                            {createBookMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Listing Book...
                              </>
                            ) : (
                              "List Book for Sale"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>
                      View and update your profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback>{user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium mb-1">{user.name}</h3>
                          <p className="text-gray-500 mb-3">Member since {new Date().toLocaleDateString()}</p>
                          <Button variant="outline" size="sm">Change Avatar</Button>
                        </div>
                      </div>

                      <Separator />
                      
                      <Form {...bookForm}>
                        <form className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={bookForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input defaultValue={user.username} {...field} value={user.username} disabled />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={bookForm.control}
                              name="author"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input defaultValue={user.email} {...field} value={user.email} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={bookForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input defaultValue={user.name} {...field} value={user.name} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={bookForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your phone number" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="pt-4">
                            <FormField
                              control={bookForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="Enter your shipping address" rows={3} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="mt-6 flex gap-3">
                            <Button type="submit">Save Changes</Button>
                            <Button variant="outline">Cancel</Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Email Notifications</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="notify-orders" />
                            <label htmlFor="notify-orders">Order updates</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="notify-promotions" />
                            <label htmlFor="notify-promotions">Promotions and deals</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="notify-newsletter" defaultChecked />
                            <label htmlFor="notify-newsletter">Newsletter</label>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Payment Methods</h3>
                        <Button variant="outline" className="flex items-center gap-2">
                          <CircleDollarSign className="h-4 w-4" />
                          <span>Add Payment Method</span>
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2 text-red-600">Danger Zone</h3>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
