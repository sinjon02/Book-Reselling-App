import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BookOpen, MessageCircle, Users, Calendar, Heart, ChevronRight, Share2, MessageSquare, ThumbsUp, Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Link } from "wouter";

const communityPosts = [
  {
    id: 1,
    user: {
      name: "Alice Johnson",
      avatar: "/images/avatars/alice.jpg",
      fallback: "AJ",
    },
    date: "2 days ago",
    title: "What's your favorite classic novel?",
    content: "I'm looking to expand my reading in classic literature. I've already read Jane Austen and the Brontë sisters, but I'm looking for recommendations beyond that. What are your absolute must-read classics?",
    likes: 24,
    comments: 15,
    tags: ["Classics", "Recommendations"],
  },
  {
    id: 2,
    user: {
      name: "Robert Chen",
      avatar: "/images/avatars/robert.jpg",
      fallback: "RC",
    },
    date: "4 days ago",
    title: "Book club recommendations for June",
    content: "Our local book club is looking for recommendations for our June reading. We prefer contemporary fiction that sparks good discussions. Any suggestions that have worked well for your book clubs?",
    likes: 18,
    comments: 32,
    tags: ["Book Club", "Contemporary"],
  },
  {
    id: 3,
    user: {
      name: "Sarah Miller",
      avatar: "/images/avatars/sarah.jpg",
      fallback: "SM",
    },
    date: "1 week ago",
    title: "Looking for sci-fi books with female protagonists",
    content: "I've been reading a lot of sci-fi lately but noticed a lack of strong female lead characters. Can anyone recommend some good science fiction with women as the main characters?",
    likes: 45,
    comments: 28,
    tags: ["Sci-Fi", "Female Protagonists"],
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Virtual Author Q&A: Margaret Atwood",
    date: "June 15, 2023",
    time: "7:00 PM EST",
    attendees: 342,
    type: "Virtual",
  },
  {
    id: 2,
    title: "Local Book Exchange Meetup",
    date: "June 18, 2023",
    time: "2:00 PM",
    attendees: 48,
    type: "In-Person",
  },
  {
    id: 3,
    title: "Book Club Discussion: Project Hail Mary",
    date: "June 25, 2023",
    time: "6:30 PM",
    attendees: 27,
    type: "Hybrid",
  }
];

const bookReviewGroups = [
  {
    id: 1,
    name: "Mystery Lovers",
    members: 1245,
    description: "For fans of whodunits, detective stories, and thrillers.",
    activity: "Very Active",
  },
  {
    id: 2,
    name: "Science Fiction Collective",
    members: 987,
    description: "Discussing the latest in sci-fi and speculative fiction.",
    activity: "Active",
  },
  {
    id: 3,
    name: "Literary Fiction Critics",
    members: 765,
    description: "Deep analysis of literary fiction, both classic and contemporary.",
    activity: "Active",
  }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions");
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-br from-primary/10 to-primary/5 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Welcome to the <span className="text-primary">Bibliboo Community</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Connect with fellow book lovers, join discussions, participate in events, and share your passion for reading.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button size="lg" className="rounded-full">
                Join a Discussion
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                Explore Book Clubs
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-lg">
              <TabsTrigger value="discussions" className="text-sm sm:text-base">
                <MessageCircle className="h-4 w-4 mr-2" />
                Discussions
              </TabsTrigger>
              <TabsTrigger value="events" className="text-sm sm:text-base">
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger value="groups" className="text-sm sm:text-base">
                <Users className="h-4 w-4 mr-2" />
                Groups
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Discussions Tab */}
          <TabsContent value="discussions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Community Discussions</h2>
                  <Button variant="outline" className="rounded-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </div>

                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  {communityPosts.map((post) => (
                    <motion.div key={post.id} variants={item}>
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="bg-gray-50 pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{post.user.fallback}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{post.user.name}</p>
                                <p className="text-xs text-gray-500">{post.date}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                          <p className="text-gray-600">{post.content}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <div className="flex gap-4">
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="flex justify-center mt-8">
                  <Button variant="outline" className="rounded-full">
                    View More Discussions
                  </Button>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Community Guidelines</CardTitle>
                    <CardDescription>
                      Please follow these guidelines when participating
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">1</div>
                      <p className="text-sm">Be respectful and kind to other community members</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">2</div>
                      <p className="text-sm">No spam, self-promotion, or excessive posting</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">3</div>
                      <p className="text-sm">Keep discussions related to books and reading</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">4</div>
                      <p className="text-sm">Respect copyright and intellectual property</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">5</div>
                      <p className="text-sm">Report inappropriate content to moderators</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Popular Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Fiction</Badge>
                      <Badge variant="outline">Non-Fiction</Badge>
                      <Badge variant="outline">Fantasy</Badge>
                      <Badge variant="outline">Sci-Fi</Badge>
                      <Badge variant="outline">Book Club</Badge>
                      <Badge variant="outline">Recommendations</Badge>
                      <Badge variant="outline">Reading Challenge</Badge>
                      <Badge variant="outline">Author Interview</Badge>
                      <Badge variant="outline">New Release</Badge>
                      <Badge variant="outline">Classics</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <Button variant="outline" className="rounded-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show" 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {upcomingEvents.map((event) => (
                  <motion.div key={event.id} variants={item}>
                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3 flex-1">
                        <div className="flex justify-between">
                          <Badge variant={
                            event.type === "Virtual" ? "outline" : 
                            event.type === "In-Person" ? "secondary" : 
                            "default"
                          }>
                            {event.type}
                          </Badge>
                          <div className="text-sm text-gray-500">{event.attendees} attending</div>
                        </div>
                        <CardTitle className="mt-3">{event.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center text-gray-600 mt-2">
                            <Calendar className="h-4 w-4 mr-2" />
                            {event.date} • {event.time}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="border-t pt-4">
                        <Button className="w-full">Register</Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Past Event Highlights</h2>
                
                <div className="relative overflow-hidden rounded-lg bg-gray-100 h-80 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 z-10 flex items-center">
                    <div className="p-8 text-white">
                      <Badge className="mb-4">Author Spotlight</Badge>
                      <h3 className="text-2xl font-bold mb-2">An Evening with Kazuo Ishiguro</h3>
                      <p className="mb-4 text-gray-200 max-w-md">
                        Relive our special event with Nobel Prize winner Kazuo Ishiguro as he discussed his latest novel "Klara and the Sun".
                      </p>
                      <Button variant="outline" className="text-white border-white hover:bg-white/20">
                        Watch Recording
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-700 to-gray-900 absolute inset-0"></div>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button variant="outline" className="rounded-full">
                    Browse All Events <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold mb-4">Join Our Reading Groups</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  Connect with like-minded readers who share your literary interests. Our community groups offer places to discuss books, share recommendations, and make connections.
                </p>
              </div>

              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
              >
                {bookReviewGroups.map((group) => (
                  <motion.div key={group.id} variants={item}>
                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-full bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <Badge variant={
                            group.activity === "Very Active" ? "default" :
                            group.activity === "Active" ? "secondary" :
                            "outline"
                          }>
                            {group.activity}
                          </Badge>
                        </div>
                        <CardTitle>{group.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center mt-1">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{group.members} members</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-gray-600">{group.description}</p>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Button className="w-full">Join Group</Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <div className="bg-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-xl font-bold mb-2">Start Your Own Group</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Can't find a group that matches your interests? Create your own reading group and invite other book lovers to join you in discussing your favorite genres or authors.
                </p>
                <Button size="lg">
                  Create a Reading Group
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Call to Action */}
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to join our community?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Create an account to participate in discussions, join reading groups, and connect with other book lovers.
            </p>
            {user ? (
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/books">Browse Books</Link>
              </Button>
            ) : (
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/auth">Sign Up Now</Link>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}