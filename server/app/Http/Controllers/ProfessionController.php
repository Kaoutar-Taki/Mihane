<?php

namespace App\Http\Controllers;

use App\Models\Profession;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class ProfessionController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'active');
        $q = Profession::query();
        if ($status === 'archived') {
            $q->onlyTrashed();
        } elseif ($status === 'all') {
            $q->withTrashed();
        }
        return response()->json($q->orderBy('id')->get(['id','name_ar','name_fr','image','deleted_at','created_at','updated_at']));
    }

    public function show(Profession $profession)
    {
        return response()->json($profession);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_ar' => ['required','string','max:100'],
            'name_fr' => ['nullable','string','max:100'],
            'image' => ['nullable','string','max:255'],
        ]);
        $p = Profession::create($data);
        return response()->json($p, Response::HTTP_CREATED);
    }

    public function update(Request $request, Profession $profession)
    {
        $data = $request->validate([
            'name_ar' => ['sometimes','string','max:100'],
            'name_fr' => ['sometimes','nullable','string','max:100'],
            'image' => ['sometimes','nullable','string','max:255'],
        ]);
        $profession->update($data);
        return response()->json($profession);
    }

    public function destroy(Profession $profession)
    {
        $profession->delete();
        return response()->json(['ok' => true]);
    }

    public function restore($id)
    {
        $p = Profession::onlyTrashed()->findOrFail($id);
        $p->restore();
        return response()->json($p);
    }

    public function forceDestroy($id)
    {
        $p = Profession::onlyTrashed()->findOrFail($id);
        $p->forceDelete();
        return response()->json(['ok' => true]);
    }

    public function uploadImage(Request $request, Profession $profession)
    {
        $request->validate([
            'image' => ['required','image','max:2048'], 
        ]);
        $file = $request->file('image');
        $path = $file->store('professions', 'public');
        $profession->image = url(Storage::url($path));
        $profession->save();
        return response()->json(['image' => $profession->image, 'profession' => $profession]);
    }
}
