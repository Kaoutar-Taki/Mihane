// Image Collection Utility for Avatar Management
export interface AvatarImage {
  id: string;
  name: string;
  url: string;
  type: 'user' | 'artisan' | 'admin';
  uploadedAt: string;
}

// Generate avatar images for users without photos
export const generateAvatarImages = async (): Promise<AvatarImage[]> => {
  const avatarImages: AvatarImage[] = [];
  
  // Common Moroccan names for avatar generation
  const moroccanNames = [
    { name: "محمد بن علي", type: "artisan" },
    { name: "فاطمة الزهراء", type: "user" },
    { name: "أحمد بنعلي", type: "artisan" },
    { name: "خديجة المرابط", type: "user" },
    { name: "يوسف العلمي", type: "user" },
    { name: "عائشة القاسمي", type: "user" },
    { name: "حسن المغربي", type: "artisan" },
    { name: "زينب الفاسي", type: "user" },
    { name: "عبد الرحمن التازي", type: "artisan" },
    { name: "مريم الرباطي", type: "user" },
    { name: "كوثر تقي", type: "admin" },
    { name: "سعد الدين", type: "artisan" },
    { name: "نادية الحسني", type: "user" },
    { name: "طارق الأندلسي", type: "artisan" },
    { name: "سلمى الإدريسي", type: "user" }
  ];

  moroccanNames.forEach((person, index) => {
    avatarImages.push({
      id: `avatar_${index + 1}`,
      name: person.name,
      url: `/assets/avatars/generated/${person.name.replace(/\s+/g, '_').toLowerCase()}.jpg`,
      type: person.type as 'user' | 'artisan' | 'admin',
      uploadedAt: new Date().toISOString()
    });
  });

  return avatarImages;
};

// Collect and organize existing avatar images
export const collectExistingAvatars = (): AvatarImage[] => {
  const existingAvatars: AvatarImage[] = [
    {
      id: "admin_avatar",
      name: "Super Admin",
      url: "/assets/avatars/admin.jpg",
      type: "admin",
      uploadedAt: "2025-08-25T10:00:00Z"
    },
    {
      id: "ahmed_avatar", 
      name: "Ahmed Benali",
      url: "/assets/avatars/ahmed.jpg",
      type: "artisan",
      uploadedAt: "2025-08-25T09:00:00Z"
    },
    {
      id: "fatima_avatar",
      name: "Fatima Zahra", 
      url: "/assets/avatars/fatima.jpg",
      type: "user",
      uploadedAt: "2025-08-25T08:30:00Z"
    },
    {
      id: "youssef_avatar",
      name: "Youssef Alami",
      url: "/assets/avatars/youssef.jpg", 
      type: "user",
      uploadedAt: "2025-08-25T07:45:00Z"
    },
    {
      id: "hassan_avatar",
      name: "Hassan Tazi",
      url: "/assets/avatars/hassan.jpg",
      type: "artisan", 
      uploadedAt: "2025-08-24T15:00:00Z"
    }
  ];

  return existingAvatars;
};

// Create avatar directory structure
export const createAvatarDirectories = () => {
  const directories = [
    "/assets/avatars/",
    "/assets/avatars/generated/",
    "/assets/avatars/uploaded/", 
    "/assets/avatars/default/"
  ];

  console.log("Avatar directories to create:", directories);
  return directories;
};

// Generate initials-based avatar URLs for users without images
export const generateInitialsAvatarUrl = (name: string): string => {
  if (!name) return "/assets/avatars/default/anonymous.svg";
  
  const initials = name.trim().split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
    
  return `/assets/avatars/generated/initials_${initials}.svg`;
};

// Avatar management utilities
export const avatarUtils = {
  generateAvatarImages,
  collectExistingAvatars,
  createAvatarDirectories,
  generateInitialsAvatarUrl
};

export default avatarUtils;
