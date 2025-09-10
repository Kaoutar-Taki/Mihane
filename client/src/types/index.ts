export interface User {
  id: number;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'ARTISAN' | 'CLIENT';
  phone: string;
  bio: string;
  avatar: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  language?: 'ar' | 'fr' | 'en';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
}

export interface ArtisanProfile {
  id: number;
  userId: number;
  businessName: string;
  craftType: string;
  description: string;
  address: string;
  city: string;
  region: string;
  website?: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    youtube?: string;
  };
  galleryImages: string[];
  rating: number;
  totalReviews: number;
  verifyStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isFeatured: boolean;
  profileCompletionPercentage: number;
  workingHours: {
    [key: string]: {
      open?: string;
      close?: string;
      closed?: boolean;
    };
  };
  services: string[];
  priceRange: {
    min: number;
    max: number;
  };
  categories: string[];
  visibility: 'PUBLIC' | 'PRIVATE' | 'DRAFT';
  profileViews: number;
  whatsappClicks: number;
  callClicks: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export interface Review {
  id: number;
  userId: number;
  artisanId: number;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Comment {
  id: number;
  userId: number;
  artisanId: number;
  content: string;
  parentId: number | null;
  isApproved: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface ChatMessage {
  id: number;
  senderId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatConversation {
  id: number;
  userId: number;
  artisanId: number;
  lastMessageAt: string;
  isActive: boolean;
  messages: ChatMessage[];
}

export interface Favorite {
  id: number;
  userId: number;
  artisanId: number;
  createdAt: string;
}

// Dashboard specific interfaces
export interface SuperAdminDashboard {
  overview: {
    totalArtisans: number;
    totalClients: number;
    todayReviews: number;
    pendingComplaints: number;
  };
  userManagement: {
    pendingUsers: User[];
    recentRegistrations: User[];
  };
  profileModeration: {
    pendingVerification: ArtisanProfile[];
    rejectedProfiles: ArtisanProfile[];
  };
  categoryManagement: {
    crafts: Category[];
    regions: Region[];
    cities: City[];
  };
  contentModeration: {
    flaggedReviews: Review[];
    reportedProfiles: Report[];
  };
  featuredArtisans: ArtisanProfile[];
}

export interface ArtisanDashboard {
  profileCompletion: {
    percentage: number;
    missingFields: string[];
    warnings: string[];
  };
  profileData: {
    description: string;
    gallery: string[];
    pricing: { min: number; max: number };
    contactInfo: ContactInfo;
    visibility: 'PUBLIC' | 'PRIVATE' | 'DRAFT';
  };
  chatManagement: {
    activeConversations: ChatConversation[];
    unreadMessages: number;
    savedReplies: SavedReply[];
  };
  reviewsManagement: {
    reviews: Review[];
    averageRating: number;
    canReply: boolean;
  };
  statistics: {
    profileViews: number;
    whatsappClicks: number;
    callClicks: number;
    monthlyStats: MonthlyStats;
  };
}

export interface ClientDashboard {
  accountInfo: {
    personalData: User;
    languagePreference: 'ar' | 'fr' | 'en';
  };
  conversations: ChatConversation[];
  myReviews: {
    reviews: Review[];
    canEdit: boolean;
    canDelete: boolean;
  };
  wishlist?: {
    savedArtisans: ArtisanProfile[];
    savedItems: WishlistItem[];
  };
}

export interface ActivityItem {
  type: 'new_review' | 'new_message' | 'new_user' | 'profile_update';
  message: string;
  timestamp: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'ARTISAN' | 'CLIENT';
  phone?: string;
}

// Permission system for ADMIN role
export type Permission = 
  | 'ModerateProfiles'
  | 'ModerateReviews' 
  | 'ManageUsers'
  | 'ManageTaxonomies'
  | 'ContentPages'
  | 'ViewAnalytics'
  | 'ManageBanners'
  | 'ManageFeatured';

export interface PermissionScope {
  type: 'ALL' | 'REGION' | 'CITY' | 'CRAFT' | 'TEMPORAL';
  values?: string[];
  expiresAt?: string;
}

export interface AdminPermission {
  permission: Permission;
  scope: PermissionScope;
  grantedBy: number;
  grantedAt: string;
}

export interface AdminUser extends User {
  role: 'ADMIN';
  permissions: AdminPermission[];
}

// Onboarding system
export interface OnboardingStep {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  isCompleted: boolean;
  isRequired: boolean;
  fields: OnboardingField[];
}

export interface OnboardingField {
  name: string;
  label: string;
  labelAr: string;
  type: 'text' | 'textarea' | 'select' | 'file' | 'multiselect';
  isRequired: boolean;
  options?: { value: string; label: string; labelAr: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    fileTypes?: string[];
    maxFiles?: number;
  };
}

// 2FA system
export interface TwoFactorAuth {
  isEnabled: boolean;
  method: 'EMAIL' | 'SMS';
  backupCodes?: string[];
  lastUsedAt?: string;
}

// Audit logging
export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// Notification system
export interface Notification {
  id: number;
  userId: number;
  type: 'EMAIL' | 'IN_APP' | 'SMS';
  category: 'ACCOUNT' | 'MESSAGE' | 'REVIEW' | 'SYSTEM';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Empty states
export interface EmptyState {
  icon: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  actionText?: string;
  actionTextAr?: string;
  actionUrl?: string;
}

export interface ArtisanProfileForm {
  businessName: string;
  craftType: string;
  description: string;
  address: string;
  city: string;
  website?: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  services: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

// Additional interfaces for dashboard functionality
export interface Region {
  id: number;
  name: string;
  nameAr: string;
  slug: string;
  isActive: boolean;
}

export interface City {
  id: number;
  name: string;
  nameAr: string;
  regionId: number;
  slug: string;
  isActive: boolean;
}

export interface ContactInfo {
  phone: string;
  whatsapp?: string;
  email: string;
  address: string;
  city: string;
  region: string;
}

export interface SavedReply {
  id: number;
  title: string;
  content: string;
  artisanId: number;
  createdAt: string;
}

export interface MonthlyStats {
  month: string;
  profileViews: number;
  whatsappClicks: number;
  callClicks: number;
  newReviews: number;
}

export interface WishlistItem {
  id: number;
  userId: number;
  artisanId: number;
  itemType: 'PROFILE' | 'SERVICE';
  itemId: number;
  createdAt: string;
}

export interface Report {
  id: number;
  reporterId: number;
  reportedId: number;
  reportType: 'PROFILE' | 'REVIEW' | 'MESSAGE';
  reason: string;
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

// Profile completion tracking
export interface ProfileCompletionField {
  field: string;
  label: string;
  labelAr: string;
  isRequired: boolean;
  isCompleted: boolean;
  weight: number;
}
