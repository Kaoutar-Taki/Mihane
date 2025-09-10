import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Star, MessageSquare, CheckCircle, Clock, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface ReviewNotification {
  id: string;
  type: "new_review" | "review_approved" | "review_rejected" | "review_response";
  title: { ar: string; fr: string };
  message: { ar: string; fr: string };
  reviewId: string;
  artisanId?: string;
  clientId?: string;
  rating?: number;
  isRead: boolean;
  createdAt: string;
}

interface ReviewNotificationsProps {
  className?: string;
}

export default function ReviewNotifications({ className = "" }: ReviewNotificationsProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "fr";
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState<ReviewNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load notifications from localStorage
  useEffect(() => {
    if (!user) return;
    
    const loadNotifications = () => {
      const stored = localStorage.getItem(`review_notifications_${user.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed.filter((n: ReviewNotification) => {
          // Filter notifications based on user role
          if (user.role === "CLIENT") {
            return n.clientId === user.id;
          } else if (user.role === "ARTISAN") {
            return n.artisanId === user.id;
          } else if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
            return true; // Admins see all notifications
          }
          return false;
        }));
      }
    };

    loadNotifications();
    
    // Listen for new notifications
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `review_notifications_${user.id}`) {
        loadNotifications();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Create notification helper function
  const createNotification = (notification: Omit<ReviewNotification, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotification: ReviewNotification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date().toISOString()
    };

    // Add to localStorage for the target user
    const targetUserId = notification.artisanId || notification.clientId;
    if (targetUserId) {
      const stored = localStorage.getItem(`review_notifications_${targetUserId}`);
      const existing = stored ? JSON.parse(stored) : [];
      const updated = [newNotification, ...existing].slice(0, 50); // Keep only last 50 notifications
      localStorage.setItem(`review_notifications_${targetUserId}`, JSON.stringify(updated));
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    
    if (user) {
      localStorage.setItem(`review_notifications_${user.id}`, JSON.stringify(updated));
    }
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    
    if (user) {
      localStorage.setItem(`review_notifications_${user.id}`, JSON.stringify(updated));
    }
  };

  // Delete notification
  const deleteNotification = (notificationId: string) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    
    if (user) {
      localStorage.setItem(`review_notifications_${user.id}`, JSON.stringify(updated));
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: ReviewNotification['type']) => {
    switch (type) {
      case "new_review":
        return <Star className="w-5 h-5 text-yellow-500" />;
      case "review_approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "review_rejected":
        return <X className="w-5 h-5 text-red-500" />;
      case "review_response":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return lang === "ar" ? "الآن" : "Maintenant";
    } else if (diffInMinutes < 60) {
      return lang === "ar" ? `منذ ${diffInMinutes} دقيقة` : `Il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return lang === "ar" ? `منذ ${hours} ساعة` : `Il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return lang === "ar" ? `منذ ${days} يوم` : `Il y a ${days}j`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {lang === "ar" ? "الإشعارات" : "Notifications"}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  {lang === "ar" ? "قراءة الكل" : "Tout lire"}
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {lang === "ar" ? "لا توجد إشعارات" : "Aucune notification"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-orange-50 border-l-4 border-orange-500" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {lang === "ar" ? notification.title.ar : notification.title.fr}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {lang === "ar" ? notification.message.ar : notification.message.fr}
                        </p>
                        
                        {notification.rating && (
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < notification.rating! ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 text-center">
              <button
                onClick={() => {
                  setNotifications([]);
                  if (user) {
                    localStorage.removeItem(`review_notifications_${user.id}`);
                  }
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {lang === "ar" ? "مسح جميع الإشعارات" : "Effacer toutes les notifications"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Export helper function to create notifications from other components
export const createReviewNotification = (notification: Omit<ReviewNotification, 'id' | 'isRead' | 'createdAt'>) => {
  const newNotification: ReviewNotification = {
    ...notification,
    id: Date.now().toString(),
    isRead: false,
    createdAt: new Date().toISOString()
  };

  // Add to localStorage for the target user
  const targetUserId = notification.artisanId || notification.clientId;
  if (targetUserId) {
    const stored = localStorage.getItem(`review_notifications_${targetUserId}`);
    const existing = stored ? JSON.parse(stored) : [];
    const updated = [newNotification, ...existing].slice(0, 50); // Keep only last 50 notifications
    localStorage.setItem(`review_notifications_${targetUserId}`, JSON.stringify(updated));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: `review_notifications_${targetUserId}`,
      newValue: JSON.stringify(updated)
    }));
  }
};
