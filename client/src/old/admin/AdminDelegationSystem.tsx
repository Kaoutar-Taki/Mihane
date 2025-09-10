import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Shield, MapPin, Clock, Briefcase, Eye, Save, X } from "lucide-react";
import type { AdminGrant, User } from "../../types";

interface AdminDelegationSystemProps {
  onGrantsChange?: (grants: AdminGrant[]) => void;
}

export default function AdminDelegationSystem({ onGrantsChange }: AdminDelegationSystemProps) {
  const [grants, setGrants] = useState<AdminGrant[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGrant, setEditingGrant] = useState<AdminGrant | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for dropdowns
  const availableUsers = [
    { id: "user1", name: "أحمد المدير", email: "ahmed@example.com", role: "USER" as const },
    { id: "user2", name: "فاطمة الإدارية", email: "fatima@example.com", role: "USER" as const },
    { id: "user3", name: "محمد المشرف", email: "mohamed@example.com", role: "USER" as const }
  ];

  const cities = ["فاس", "الدار البيضاء", "الرباط", "مراكش", "مكناس", "تطوان"];
  const craftTypes = ["فخار وخزف", "جلود وماروكينري", "نجارة وخشب", "نسيج وخياطة", "مجوهرات وحلي"];

  useEffect(() => {
    // Load existing grants from localStorage
    const savedGrants = localStorage.getItem('admin_grants');
    if (savedGrants) {
      const parsed = JSON.parse(savedGrants);
      setGrants(parsed);
      onGrantsChange?.(parsed);
    }
  }, [onGrantsChange]);

  const saveGrants = (newGrants: AdminGrant[]) => {
    setGrants(newGrants);
    localStorage.setItem('admin_grants', JSON.stringify(newGrants));
    onGrantsChange?.(newGrants);
  };

  const createGrant = (grantData: Omit<AdminGrant, 'id' | 'createdAt' | 'createdBy'>) => {
    const newGrant: AdminGrant = {
      ...grantData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: "super_admin_1" // In real app, get from auth context
    };

    const newGrants = [...grants, newGrant];
    saveGrants(newGrants);
    setShowCreateForm(false);
  };

  const updateGrant = (updatedGrant: AdminGrant) => {
    const newGrants = grants.map(grant => 
      grant.id === updatedGrant.id ? updatedGrant : grant
    );
    saveGrants(newGrants);
    setEditingGrant(null);
  };

  const deleteGrant = (grantId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التفويض؟')) {
      const newGrants = grants.filter(grant => grant.id !== grantId);
      saveGrants(newGrants);
    }
  };

  const toggleGrantStatus = (grantId: string) => {
    const newGrants = grants.map(grant => 
      grant.id === grantId ? { ...grant, isActive: !grant.isActive } : grant
    );
    saveGrants(newGrants);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">نظام تفويض الصلاحيات</h2>
          <p className="text-gray-600 mt-1">إدارة صلاحيات المديرين المفوضين</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          تفويض جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي التفويضات</p>
              <p className="text-xl font-bold text-gray-900">{grants.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">نشط</p>
              <p className="text-xl font-bold text-gray-900">{grants.filter(g => g.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">مؤقت</p>
              <p className="text-xl font-bold text-gray-900">
                {grants.filter(g => g.expiresAt && new Date(g.expiresAt) > new Date()).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">منتهي الصلاحية</p>
              <p className="text-xl font-bold text-gray-900">
                {grants.filter(g => g.expiresAt && new Date(g.expiresAt) <= new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grants List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">التفويضات الحالية</h3>
        </div>
        
        {grants.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تفويضات</h3>
            <p className="text-gray-600 mb-4">ابدأ بإنشاء تفويض جديد لمنح صلاحيات إدارية</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              إنشاء تفويض جديد
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {grants.map(grant => (
              <GrantCard
                key={grant.id}
                grant={grant}
                users={availableUsers}
                onEdit={() => setEditingGrant(grant)}
                onDelete={() => deleteGrant(grant.id)}
                onToggleStatus={() => toggleGrantStatus(grant.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingGrant) && (
        <GrantFormModal
          grant={editingGrant}
          users={availableUsers}
          cities={cities}
          craftTypes={craftTypes}
          onSave={editingGrant ? updateGrant : createGrant}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingGrant(null);
          }}
        />
      )}
    </div>
  );
}

interface GrantCardProps {
  grant: AdminGrant;
  users: User[];
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

function GrantCard({ grant, users, onEdit, onDelete, onToggleStatus }: GrantCardProps) {
  const user = users.find(u => u.id === grant.userId);
  const isExpired = grant.expiresAt && new Date(grant.expiresAt) <= new Date();

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-lg font-semibold text-gray-900">
              {user?.name || "مستخدم غير معروف"}
            </h4>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              !grant.isActive ? 'bg-gray-100 text-gray-600' :
              isExpired ? 'bg-red-100 text-red-700' :
              'bg-green-100 text-green-700'
            }`}>
              {!grant.isActive ? 'معطل' : isExpired ? 'منتهي' : 'نشط'}
            </div>
          </div>
          
          <p className="text-gray-600 mb-3">{user?.email}</p>

          {/* Permissions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {grant.permissions.map(permission => (
              <span
                key={permission}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {getPermissionLabel(permission)}
              </span>
            ))}
          </div>

          {/* Scopes */}
          <div className="space-y-2 text-sm text-gray-600">
            {grant.scopes.geographic && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>المناطق: {grant.scopes.geographic.join(', ')}</span>
              </div>
            )}
            {grant.scopes.craft && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>الحرف: {grant.scopes.craft.join(', ')}</span>
              </div>
            )}
            {grant.expiresAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>ينتهي في: {new Date(grant.expiresAt).toLocaleDateString('ar-MA')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleStatus}
            className={`p-2 rounded-lg transition-colors ${
              grant.isActive 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={grant.isActive ? 'تعطيل' : 'تفعيل'}
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="تعديل"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface GrantFormModalProps {
  grant?: AdminGrant | null;
  users: User[];
  cities: string[];
  craftTypes: string[];
  onSave: (grant: any) => void;
  onCancel: () => void;
}

function GrantFormModal({ grant, users, cities, craftTypes, onSave, onCancel }: GrantFormModalProps) {
  const [formData, setFormData] = useState({
    userId: grant?.userId || '',
    permissions: grant?.permissions || [],
    scopes: {
      geographic: grant?.scopes.geographic || [],
      craft: grant?.scopes.craft || []
    },
    expiresAt: grant?.expiresAt || '',
    isActive: grant?.isActive ?? true
  });

  const availablePermissions = [
    'manage_users',
    'manage_artisans', 
    'manage_categories',
    'view_analytics',
    'moderate_content',
    'manage_reviews'
  ];

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleScopeToggle = (type: 'geographic' | 'craft', value: string) => {
    setFormData(prev => ({
      ...prev,
      scopes: {
        ...prev.scopes,
        [type]: prev.scopes[type].includes(value)
          ? prev.scopes[type].filter(v => v !== value)
          : [...prev.scopes[type], value]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || formData.permissions.length === 0) return;
    
    onSave(grant ? { ...grant, ...formData } : formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {grant ? 'تعديل التفويض' : 'تفويض جديد'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المستخدم *
            </label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              dir="rtl"
            >
              <option value="">اختر المستخدم</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              الصلاحيات *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availablePermissions.map(permission => (
                <label key={permission} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">
                    {getPermissionLabel(permission)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Geographic Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              النطاق الجغرافي
            </label>
            <div className="grid grid-cols-3 gap-3">
              {cities.map(city => (
                <label key={city} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.scopes.geographic.includes(city)}
                    onChange={() => handleScopeToggle('geographic', city)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{city}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Craft Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              نطاق الحرف
            </label>
            <div className="grid grid-cols-2 gap-3">
              {craftTypes.map(craft => (
                <label key={craft} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.scopes.craft.includes(craft)}
                    onChange={() => handleScopeToggle('craft', craft)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{craft}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ الانتهاء (اختياري)
            </label>
            <input
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              تفعيل التفويض
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all"
            >
              {grant ? 'حفظ التغييرات' : 'إنشاء التفويض'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getPermissionLabel(permission: string): string {
  const labels: Record<string, string> = {
    'manage_users': 'إدارة المستخدمين',
    'manage_artisans': 'إدارة الحرفيين',
    'manage_categories': 'إدارة الفئات',
    'view_analytics': 'عرض التحليلات',
    'moderate_content': 'إشراف المحتوى',
    'manage_reviews': 'إدارة التقييمات'
  };
  return labels[permission] || permission;
}
