import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Star, MapPin, Heart, MessageCircle, Grid, List } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import type { ArtisanProfile, Category } from "../types";
import artisanProfilesData from "../data/artisanProfiles.json";
import categoriesData from "../data/categories.json";

export default function BrowsePage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rating" | "newest" | "name">("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const artisans = artisanProfilesData as ArtisanProfile[];
  const categories = categoriesData as Category[];

  // Get unique cities from artisans
  const cities = useMemo(() => {
    const citySet = new Set(artisans.map(artisan => artisan.city));
    return Array.from(citySet).sort();
  }, [artisans]);

  // Load favorites from localStorage
  useEffect(() => {
    if (user?.role === "CLIENT") {
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [user]);

  // Filter and sort artisans
  const filteredArtisans = useMemo(() => {
    let filtered = artisans.filter(artisan => {
      const matchesSearch = !searchTerm || 
        artisan.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        artisan.categories.some(cat => cat.id === selectedCategory);
      
      const matchesCity = !selectedCity || artisan.city === selectedCity;
      
      return matchesSearch && matchesCategory && matchesCity && artisan.isActive;
    });

    // Sort results
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "name":
        filtered.sort((a, b) => a.businessName.localeCompare(b.businessName));
        break;
    }

    return filtered;
  }, [artisans, searchTerm, selectedCategory, selectedCity, sortBy]);

  const toggleFavorite = (artisanId: string) => {
    if (user?.role !== "CLIENT") return;
    
    const newFavorites = favorites.includes(artisanId)
      ? favorites.filter(id => id !== artisanId)
      : [...favorites, artisanId];
    
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCity("");
    setSortBy("rating");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                استكشف الحرفيين
              </h1>
              <p className="text-gray-600 mt-1">
                اكتشف أفضل الحرفيين والمهنيين في المغرب
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن حرفي أو مهنة..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  dir="rtl"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">المرشحات</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  مسح الكل
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  dir="rtl"
                >
                  <option value="">جميع الفئات</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  dir="rtl"
                >
                  <option value="">جميع المدن</option>
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ترتيب حسب
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "rating" | "newest" | "name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  dir="rtl"
                >
                  <option value="rating">التقييم</option>
                  <option value="newest">الأحدث</option>
                  <option value="name">الاسم</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  {filteredArtisans.length} حرفي
                </p>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  المرشحات
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results Grid/List */}
            {filteredArtisans.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  لم يتم العثور على نتائج
                </h3>
                <p className="text-gray-600 mb-4">
                  جرب تغيير المرشحات أو البحث بكلمات مختلفة
                </p>
                <button
                  onClick={clearFilters}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  مسح جميع المرشحات
                </button>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredArtisans.map(artisan => (
                  <div
                    key={artisan.id}
                    className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                      viewMode === "list" ? "flex gap-4 p-4" : "overflow-hidden"
                    }`}
                  >
                    {/* Image */}
                    <div className={viewMode === "list" ? "w-24 h-24 flex-shrink-0" : "h-48"}>
                      <img
                        src={artisan.avatar}
                        alt={artisan.businessName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className={viewMode === "list" ? "flex-1 min-w-0" : "p-4"}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {artisan.businessName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{artisan.city}</span>
                          </div>
                        </div>
                        
                        {user?.role === "CLIENT" && (
                          <button
                            onClick={() => toggleFavorite(artisan.id)}
                            className={`p-2 rounded-full transition-colors ${
                              favorites.includes(artisan.id)
                                ? "text-red-500 hover:text-red-600"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${favorites.includes(artisan.id) ? "fill-current" : ""}`} />
                          </button>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(artisan.averageRating || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {artisan.averageRating?.toFixed(1) || "0.0"} ({artisan.reviewCount || 0})
                        </span>
                      </div>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {artisan.categories.slice(0, 2).map(category => (
                          <span
                            key={category.id}
                            className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                          >
                            {category.nameAr}
                          </span>
                        ))}
                        {artisan.categories.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{artisan.categories.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {artisan.description}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/artisan/${artisan.id}`}
                          className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-center py-2 px-4 rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all text-sm font-medium"
                        >
                          عرض الملف
                        </Link>
                        {user?.role === "CLIENT" && (
                          <Link
                            to={`/chat/${artisan.userId}`}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
