<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\ArtisanProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function indexByProfile(Request $request, ArtisanProfile $artisan)
    {
        $status = $request->query('status', 'APPROVED');
        $q = Review::query()->where('profile_id', $artisan->id);
        if ($status && in_array($status, ['PENDING','APPROVED','REJECTED'])) {
            $q->where('status', $status);
        } else if ($status === 'all') {
        } else {
            $q->where('status', 'APPROVED');
        }
        $q->with(['user:id,name,email']);
        return response()->json($q->orderByDesc('id')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'profile_id' => ['required','integer','exists:artisan_profiles,id'],
            'rating' => ['required','integer','min:1','max:5'],
            'comment' => ['required','string','max:5000'],
            'visibility' => ['in:PUBLIC,PRIVATE']
        ]);
        $userId = Auth::id();
        if (!$userId) return response()->json(['message' => 'Unauthenticated.'], 401);
        $data['user_id'] = $userId;
        $review = Review::create($data);
        $review->load(['user:id,name,email']);
        return response()->json($review, Response::HTTP_CREATED);
    }

    public function respond(Request $request, Review $review)
    {
        $userId = Auth::id();
        if (!$userId) return response()->json(['message' => 'Unauthenticated.'], 401);
        $profile = ArtisanProfile::findOrFail($review->profile_id);
        if ($profile->user_id !== $userId) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }
        $data = $request->validate([
            'comment' => ['required','string','max:2000']
        ]);
        $review->artisan_response = [
            'comment' => $data['comment'],
            'respondedAt' => now()->toISOString(),
        ];
        $review->save();
        $review->load(['user:id,name,email']);
        return response()->json($review);
    }

    public function updateStatus(Request $request, Review $review)
    {
        $data = $request->validate([
            'status' => ['required','in:PENDING,APPROVED,REJECTED']
        ]);
        $review->status = $data['status'];
        $review->save();
        return response()->json($review);
    }

    public function destroy(Review $review)
    {
        $userId = Auth::id();
        if (!$userId) return response()->json(['message' => 'Unauthenticated.'], 401);
        $profile = ArtisanProfile::find($review->profile_id);
        if ($review->user_id !== $userId && (!$profile || $profile->user_id !== $userId)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }
        $review->delete();
        return response()->json(['ok' => true]);
    }
}
