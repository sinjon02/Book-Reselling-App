import { Link } from "wouter";
import { 
  BookOpen, Compass, Wand2, FlaskConical, Heart, MoreHorizontal,
  BookText, BookMarked, Rocket, Sparkles, Cpu, Bot, Music, PaintBucket
} from "lucide-react";
import { motion } from "framer-motion";

interface CategoryCardProps {
  category: string;
  icon: string;
}

export function CategoryCard({ category, icon }: CategoryCardProps) {
  // Color mapping based on category
  const getCategoryColor = () => {
    switch (category) {
      case "Fiction":
        return {
          bg: "from-blue-500 to-primary-600",
          light: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-200"
        };
      case "Non-Fiction":
        return {
          bg: "from-emerald-500 to-green-600",
          light: "bg-emerald-50",
          text: "text-emerald-600",
          border: "border-emerald-200"
        };
      case "Fantasy":
        return {
          bg: "from-purple-500 to-indigo-600",
          light: "bg-purple-50",
          text: "text-purple-600",
          border: "border-purple-200"
        };
      case "Sci-Fi":
        return {
          bg: "from-indigo-500 to-blue-600",
          light: "bg-indigo-50",
          text: "text-indigo-600",
          border: "border-indigo-200"
        };
      case "Romance":
        return {
          bg: "from-pink-500 to-rose-600",
          light: "bg-pink-50",
          text: "text-pink-600",
          border: "border-pink-200"
        };
      case "View All":
        return {
          bg: "from-amber-500 to-orange-600",
          light: "bg-amber-50",
          text: "text-amber-600",
          border: "border-amber-200"
        };
      default:
        return {
          bg: "from-primary to-primary-600",
          light: "bg-primary-50",
          text: "text-primary-600",
          border: "border-primary-200"
        };
    }
  };

  // Map category to icon component
  const getIcon = () => {
    const iconProps = "h-10 w-10 text-white"; 
    
    switch (icon) {
      case "book":
        return <BookText className={iconProps} />;
      case "compass":
        return <Compass className={iconProps} />;
      case "magic":
        return <Sparkles className={iconProps} />;
      case "robot":
        return <Bot className={iconProps} />;
      case "heart":
        return <Heart className={iconProps} />;
      case "more":
        return <MoreHorizontal className={iconProps} />;
      default:
        return <BookOpen className={iconProps} />;
    }
  };
  
  const colors = getCategoryColor();

  return (
    <Link href={category === 'View All' ? '/books' : `/books?category=${encodeURIComponent(category)}`}>
      <motion.div 
        className="rounded-xl overflow-hidden shadow-md cursor-pointer h-full"
        whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="flex flex-col h-full">
          <div className={`p-4 bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
            <motion.div 
              className="bg-white/20 rounded-full p-3 backdrop-blur-sm"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {getIcon()}
            </motion.div>
          </div>
          <div className="p-3 bg-white flex items-center justify-center">
            <motion.span 
              className={`font-medium ${colors.text}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {category}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
