<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'active');
        $q = Testimonial::query()->with('user:id,name,email');
        if ($status === 'archived') {
            $q->onlyTrashed();
        } elseif ($status === 'all') {
            $q->withTrashed();
        }
        return response()->json($q->orderBy('id')->get());
    }

    public function show(Testimonial $testimonial)
    {
        $testimonial->load('user:id,name,email');
        return response()->json($testimonial);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required','integer','exists:users,id'],
            'rating' => ['required','integer','min:1','max:5'],
            'comment' => ['required','string'],
            'is_approved' => ['sometimes','boolean'],
        ]);
        $t = Testimonial::create($data);
        $t->load('user:id,name,email');
        return response()->json($t, Response::HTTP_CREATED);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        try {
            $data = $request->validate([
                'user_id' => ['sometimes','integer','exists:users,id'],
                'rating' => ['sometimes','integer','min:1','max:5'],
                'comment' => ['sometimes','string'],
                'is_approved' => ['sometimes','boolean'],
            ]);
            if (empty($data)) {
                return response()->json(['message' => 'No data to update'], 422);
            }
            $testimonial->fill($data);
            $testimonial->save();
            $testimonial->load('user:id,name,email');
            return response()->json($testimonial);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Update failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return response()->json(['ok' => true]);
    }

    public function restore($id)
    {
        $t = Testimonial::onlyTrashed()->findOrFail($id);
        $t->restore();
        $t->load('user:id,name,email');
        return response()->json($t);
    }

    public function forceDestroy($id)
    {
        $t = Testimonial::onlyTrashed()->findOrFail($id);
        $t->forceDelete();
        return response()->json(['ok' => true]);
    }
}
