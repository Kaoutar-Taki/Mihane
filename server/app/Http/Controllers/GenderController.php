<?php

namespace App\Http\Controllers;

use App\Models\Gender;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GenderController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'active');
        $q = Gender::query();
        if ($status === 'archived') {
            $q->onlyTrashed();
        } elseif ($status === 'all') {
            $q->withTrashed();
        }
        return response()->json($q->orderBy('id')->get(['id','key','name_ar','name_fr','deleted_at','created_at','updated_at']));
    }

    public function show(Gender $gender)
    {
        return response()->json($gender);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'key' => ['required','string','max:20','unique:genders,key'],
            'name_ar' => ['required','string','max:50'],
            'name_fr' => ['nullable','string','max:50'],
        ]);
        $gender = Gender::create($data);
        return response()->json($gender, Response::HTTP_CREATED);
    }

    public function update(Request $request, Gender $gender)
    {
        $data = $request->validate([
            'key' => ['sometimes','string','max:20','unique:genders,key,'.$gender->id],
            'name_ar' => ['sometimes','string','max:50'],
            'name_fr' => ['sometimes','nullable','string','max:50'],
        ]);
        $gender->update($data);
        return response()->json($gender);
    }

    public function destroy(Gender $gender)
    {
        $gender->delete();
        return response()->json(['ok' => true]);
    }

    public function restore($id)
    {
        $gender = Gender::onlyTrashed()->findOrFail($id);
        $gender->restore();
        return response()->json($gender);
    }

    public function forceDestroy($id)
    {
        $gender = Gender::onlyTrashed()->findOrFail($id);
        $gender->forceDelete();
        return response()->json(['ok' => true]);
    }
}
