<?php

namespace App\Http\Controllers;

use App\Models\ArtisanProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ArtisanProfileController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'active');
        $q = ArtisanProfile::query();
        if ($status === 'archived') {
            $q->onlyTrashed();
        } elseif ($status === 'all') {
            $q->withTrashed();
        }
        $q->with(['user:id,name,email,role', 'profession:id,name_ar,name_fr', 'category:id,name_ar,name_fr']);
        return response()->json($q->orderBy('id')->get());
    }

    public function show(ArtisanProfile $artisan)
    {
        $artisan->load(['user:id,name,email,role', 'profession:id,name_ar,name_fr', 'category:id,name_ar,name_fr']);
        return response()->json($artisan);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required','integer','exists:users,id'],
            'profession_id' => ['nullable','integer','exists:professions,id'],
            'category_id' => ['nullable','integer','exists:categories,id'],
            'title_ar' => ['required','string','max:200'],
            'title_fr' => ['nullable','string','max:200'],
            'description_ar' => ['nullable','string'],
            'description_fr' => ['nullable','string'],
            'gallery' => ['array'],
            'gallery.*' => ['string'],
            'social' => ['array'],
            'availability' => ['array'],
            'address_ar' => ['nullable','string','max:255'],
            'address_fr' => ['nullable','string','max:255'],
            'visibility' => ['in:PUBLIC,PRIVATE'],
            'verify_status' => ['in:PENDING,VERIFIED,REJECTED'],
        ]);
        $profile = ArtisanProfile::create($data);
        $profile->load(['user:id,name,email,role', 'profession:id,name_ar,name_fr', 'category:id,name_ar,name_fr']);
        return response()->json($profile, Response::HTTP_CREATED);
    }

    public function update(Request $request, ArtisanProfile $artisan)
    {
        $data = $request->validate([
            'user_id' => ['sometimes','integer','exists:users,id'],
            'profession_id' => ['sometimes','nullable','integer','exists:professions,id'],
            'category_id' => ['sometimes','nullable','integer','exists:categories,id'],
            'title_ar' => ['sometimes','string','max:200'],
            'title_fr' => ['sometimes','nullable','string','max:200'],
            'description_ar' => ['sometimes','nullable','string'],
            'description_fr' => ['sometimes','nullable','string'],
            'gallery' => ['sometimes','array'],
            'gallery.*' => ['string'],
            'social' => ['sometimes','array'],
            'availability' => ['sometimes','array'],
            'address_ar' => ['sometimes','nullable','string','max:255'],
            'address_fr' => ['sometimes','nullable','string','max:255'],
            'visibility' => ['sometimes','in:PUBLIC,PRIVATE'],
            'verify_status' => ['sometimes','in:PENDING,VERIFIED,REJECTED'],
        ]);
        $artisan->update($data);
        $artisan->load(['user:id,name,email,role', 'profession:id,name_ar,name_fr', 'category:id,name_ar,name_fr']);
        return response()->json($artisan);
    }

    public function destroy(ArtisanProfile $artisan)
    {
        $artisan->delete();
        return response()->json(['ok' => true]);
    }

    public function restore($id)
    {
        $p = ArtisanProfile::onlyTrashed()->findOrFail($id);
        $p->restore();
        return response()->json($p);
    }

    public function forceDestroy($id)
    {
        $p = ArtisanProfile::onlyTrashed()->findOrFail($id);
        $p->forceDelete();
        return response()->json(['ok' => true]);
    }
}
