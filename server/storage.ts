import { 
  users, type User, type InsertUser, 
  books, type Book, type InsertBook,
  cartItems, type CartItem, type InsertCartItem,
  orders, type Order, type InsertOrder, 
  orderItems, type OrderItem, type InsertOrderItem,
  bookCategories, bookConditions, bookFormats
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Sample book data
const sampleBooks: Omit<Book, "id">[] = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A classic of modern American literature, the novel explores the issues of racism and injustice in the American South through the eyes of Scout Finch.",
    price: 12.99,
    condition: "Like New",
    format: "Paperback",
    category: "Fiction",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80"
    ],
    sellerId: 1,
    inStock: true,
    createdAt: new Date()
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel that explores the dangers of totalitarianism, mass surveillance, and repressive regimentation of people and behaviors.",
    price: 9.50,
    condition: "Very Good",
    format: "Paperback",
    category: "Fiction",
    imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
    additionalImages: [],
    sellerId: 1,
    inStock: true,
    createdAt: new Date()
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel following the character development of Elizabeth Bennet, who learns about the repercussions of hasty judgments.",
    price: 8.75,
    condition: "Good",
    format: "Paperback",
    category: "Fiction",
    imageUrl: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
    additionalImages: [],
    sellerId: 1,
    inStock: true,
    createdAt: new Date()
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "Set in the Jazz Age, the novel explores themes of decadence, idealism, and corruption through the story of self-made millionaire Jay Gatsby.",
    price: 10.50,
    condition: "Like New",
    format: "Hardcover",
    category: "Fiction",
    imageUrl: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
      "https://images.unsplash.com/photo-1585158531004-3224babed121?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80"
    ],
    sellerId: 1,
    inStock: true,
    createdAt: new Date()
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description: "The first book in the Harry Potter series, following a young wizard as he discovers his magical heritage and begins his education at Hogwarts.",
    price: 15.99,
    condition: "Very Good",
    format: "Hardcover",
    category: "Fantasy",
    imageUrl: "https://images.unsplash.com/photo-1603162525937-e5e3baef4d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
      "https://images.unsplash.com/photo-1609866138210-84bb689f0bc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80" 
    ],
    sellerId: 1,
    inStock: true,
    createdAt: new Date()
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel following the quest of Bilbo Baggins as he sets out to win a share of the treasure guarded by Smaug the dragon.",
    price: 11.25,
    condition: "Good",
    format: "Paperback",
    category: "Fantasy",
    imageUrl: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
    additionalImages: [],
    sellerId: 1,
    inStock: true,
    createdAt: new Date()
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    description: "A dystopian novel that explores the dehumanizing effects of advanced technology and social engineering in a futuristic society.",
    price: 7.50,
    condition: "Acceptable",
    format: "Paperback",
    category: "Sci-Fi",
    imageUrl: "https://images.unsplash.com/photo-1612969308146-066015efc293?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
    additionalImages: [],
    sellerId: 1,
    inStock: true,
    createdAt: new Date()
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "A novel that explores the themes of teenage alienation, innocence, and rebellion through the eyes of Holden Caulfield.",
    price: 9.25,
    condition: "Very Good",
    format: "Paperback",
    category: "Fiction",
    imageUrl: "https://images.unsplash.com/photo-1633477189729-9290b3261d0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450&q=80",
    additionalImages: [],
    sellerId: 1,
    inStock: true,
    createdAt: new Date()
  }
];

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Book methods
  getBook(id: number): Promise<Book | undefined>;
  getBooks(options?: { 
    category?: string; 
    condition?: string;
    format?: string;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
  }): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<Book>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  
  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItem(userId: number, bookId: number): Promise<CartItem | undefined>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Session store
  sessionStore: session.SessionStore;
  
  // Initialize with sample data
  initSampleData(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  
  sessionStore: session.SessionStore;
  
  private nextUserId: number;
  private nextBookId: number;
  private nextCartItemId: number;
  private nextOrderId: number;
  private nextOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    this.nextUserId = 1;
    this.nextBookId = 1;
    this.nextCartItemId = 1;
    this.nextOrderId = 1;
    this.nextOrderItemId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Book methods
  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }
  
  async getBooks(options?: { 
    category?: string; 
    condition?: string;
    format?: string;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
  }): Promise<Book[]> {
    let books = Array.from(this.books.values());
    
    if (options) {
      if (options.category) {
        books = books.filter(book => book.category === options.category);
      }
      
      if (options.condition) {
        books = books.filter(book => book.condition === options.condition);
      }
      
      if (options.format) {
        books = books.filter(book => book.format === options.format);
      }
      
      if (options.minPrice !== undefined) {
        books = books.filter(book => book.price >= options.minPrice!);
      }
      
      if (options.maxPrice !== undefined) {
        books = books.filter(book => book.price <= options.maxPrice!);
      }
      
      if (options.searchTerm) {
        const searchTerm = options.searchTerm.toLowerCase();
        books = books.filter(book => 
          book.title.toLowerCase().includes(searchTerm) || 
          book.author.toLowerCase().includes(searchTerm) ||
          book.description.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    return books;
  }
  
  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.nextBookId++;
    const createdAt = new Date();
    const book: Book = { ...insertBook, id, createdAt };
    this.books.set(id, book);
    return book;
  }
  
  async updateBook(id: number, bookData: Partial<Book>): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;
    
    const updatedBook = { ...book, ...bookData };
    this.books.set(id, updatedBook);
    return updatedBook;
  }
  
  async deleteBook(id: number): Promise<boolean> {
    return this.books.delete(id);
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      item => item.userId === userId
    );
  }
  
  async getCartItem(userId: number, bookId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      item => item.userId === userId && item.bookId === bookId
    );
  }
  
  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = await this.getCartItem(insertCartItem.userId, insertCartItem.bookId);
    
    if (existingItem) {
      // Update quantity if item exists
      const updatedQuantity = existingItem.quantity + insertCartItem.quantity;
      return this.updateCartItem(existingItem.id, updatedQuantity) as Promise<CartItem>;
    }
    
    // Add new item if it doesn't exist
    const id = this.nextCartItemId++;
    const createdAt = new Date();
    const cartItem: CartItem = { ...insertCartItem, id, createdAt };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const cartItems = await this.getCartItems(userId);
    let success = true;
    
    for (const item of cartItems) {
      const deleted = await this.removeCartItem(item.id);
      if (!deleted) success = false;
    }
    
    return success;
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.nextOrderId++;
    const createdAt = new Date();
    const order: Order = { ...insertOrder, id, createdAt };
    this.orders.set(id, order);
    return order;
  }
  
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }
  
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.nextOrderItemId++;
    const createdAt = new Date();
    const orderItem: OrderItem = { ...insertOrderItem, id, createdAt };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Initialize with sample data
  async initSampleData(): Promise<void> {
    // Create admin user if not exists
    const adminExists = await this.getUserByUsername("admin");
    if (!adminExists) {
      await this.createUser({
        username: "admin",
        password: "$2b$10$5iC4YZu7.2uKN9yM9/QVk.4j4QrkMrJ/mFGQAfQ2qSHQtHUU9xPzW", // hashed "password123"
        name: "Admin User",
        email: "admin@example.com",
        profileImage: "https://api.dicebear.com/6.x/avataaars/svg?seed=admin"
      });
    }
    
    // Add sample books if none exist
    if (this.books.size === 0) {
      for (const book of sampleBooks) {
        await this.createBook(book);
      }
    }
  }
}

export const storage = new MemStorage();
