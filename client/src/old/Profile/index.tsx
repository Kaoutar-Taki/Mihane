import { useParams } from "react-router-dom";
import profiles from "../../data/artisan-profiles.json";
import MainLayout from "../../pages/layouts/MainLayout";
import ProfileDescription from "../ProfileDescription";
import ProfileGallery from "../ProfileGallery";
import ProfileHeader from "./ProfileHeader";
import ProfileReviews from "./ProfileReviews";
import { ProfileContext } from "../ProfileContext";
import ProfileSuggestions from "../ProfileSuggestions";
import AddReview from "../AddReview";

export default function Profile() {
  const { id } = useParams();
  const rawProfile = profiles.find((p) => p.id === Number(id));

  if (!rawProfile) {
    return (
      <MainLayout>
        <div className="py-20 text-center text-gray-600">الحرفي غير موجود</div>
      </MainLayout>
    );
  }

  const selectedProfile = {
    id: rawProfile.id,
    fullName: rawProfile.fullName,
    profession: rawProfile.profession_id,
    city: rawProfile.city_id,
    genre: rawProfile.genre_id,
    image: rawProfile.image,
    description: rawProfile.description,
    gallery: rawProfile.gallery.map((g) => g),
    contact: {
      email: rawProfile.contact.email,
      phone: rawProfile.contact.phone,
      whatsapp: rawProfile.contact.whatsapp,
    },
    reviews: rawProfile.reviews.map((r) => ({
      id: r.id,
      name: r.name,
      rating: r.rating,
      comment: r.comment,
    })),
  };

  return (
    <ProfileContext.Provider value={selectedProfile}>
      <MainLayout>
        <ProfileHeader />
        <ProfileDescription />
        <ProfileGallery />
        <ProfileReviews />
        <ProfileSuggestions
          currentId={selectedProfile.id}
          professionId={selectedProfile.profession}
          cityId={selectedProfile.city}
          genreId={selectedProfile.genre}
          limit={8}
        />
      </MainLayout>
      <AddReview
        onSubmit={(rating, comment) => {
          if (!comment) return alert("المرجو كتابة تعليق مختصر.");
          // TODO: نداء API لإضافة تقييم
          console.log("ADD_REVIEW", { rating, comment });
          alert("شكراً! تم إرسال تقييمك.");
        }}
      />
    </ProfileContext.Provider>
  );
}
