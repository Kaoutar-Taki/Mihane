import { useState, useEffect } from "react";
import { Bell, X, Check, Info, AlertTriangle, CheckCircle } from "lucide-react";
import type { Notification } from "../../types";

interface NotificationSystemProps {
  userId?: string;
}

export default function NotificationSystem({ userId }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      loadNotifications();
      // Set up polling for new notifications
      const interval = setInterval(loadNotifications, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    const count = notifications.filter(n => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  const loadNotifications = () => {
    // Load from localStorage (in real app, would fetch from API)
    const saved = localStorage.getItem(`notifications_${userId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(parsed);
    } else {
      // Mock notifications for demo
      const mockNotifications: Notification[] = [
        {
          id: "1",
          userId: userId!,
          type: "system",
          title: "مرحباً بك في المنصة",
          message: "أكمل ملفك الشخصي للحصول على أفضل تجربة",
          isRead: false,
          createdAt: new Date().toISOString(),
          priority: "medium",
          actionUrl: "/profile"
        },
        {
          id: "2", 
          userId: userId!,
          type: "review",
          title: "تقييم جديد",
          message: "تلقيت تقييماً جديداً من أحد العملاء",
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          priority: "high"
        }
      ];
      setNotifications(mockNotifications);
      saveNotifications(mockNotifications);
    }
  };

  const saveNotifications = (notifs: Notification[]) => {
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifs));
  };

  const markAsRead = (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const deleteNotification = (notificationId: string) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "system": return <Info className="w-5 h-5 text-blue-500" />;
      case "review": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "message": return <Bell className="w-5 h-5 text-orange-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-yellow-500"; 
      case "low": return "border-l-blue-500";
      default: return "border-l-gray-300";
    }
  };

  return (
    <div className="relative">
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

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">الإشعارات</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  قراءة الكل
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد إشعارات</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.isRead ? "text-gray-900" : "text-gray-700"
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.createdAt).toLocaleString('ar-MA')}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-green-600"
                                title="تحديد كمقروء"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="حذف"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {notification.actionUrl && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id);
                              window.location.href = notification.actionUrl!;
                            }}
                            className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                          >
                            عرض التفاصيل
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
              >
                عرض جميع الإشعارات
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
