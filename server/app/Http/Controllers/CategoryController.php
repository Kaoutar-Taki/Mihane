<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'active');
        $q = Category::query();
        if ($status === 'archived') {
            $q->onlyTrashed();
        } elseif ($status === 'all') {
            $q->withTrashed();
        }
        $q->withCount('professions');
        return response()->json($q->orderBy('display_order')->orderBy('id')
            ->get(['id','name_ar','name_fr','description_ar','description_fr','icon','color','is_active','display_order','deleted_at','created_at','updated_at']));
    }

    public function show(Category $category)
    {
        $category->load('professions:id,name_ar,name_fr,image');
        return response()->json($category);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_ar' => ['required','string','max:150'],
            'name_fr' => ['nullable','string','max:150'],
            'description_ar' => ['nullable','string'],
            'description_fr' => ['nullable','string'],
            'icon' => ['nullable','string','max:16'],
            'color' => ['nullable','string','max:16'],
            'is_active' => ['boolean'],
            'display_order' => ['nullable','integer','min:0'],
            'professionIds' => ['array'],
            'professionIds.*' => ['integer','exists:professions,id'],
        ]);
        $professionIds = $data['professionIds'] ?? [];
        unset($data['professionIds']);
        $category = Category::create($data);
        if (!empty($professionIds)) {
            $category->professions()->sync($professionIds);
        }
        $category->loadCount('professions');
        return response()->json($category, Response::HTTP_CREATED);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name_ar' => ['sometimes','string','max:150'],
            'name_fr' => ['sometimes','nullable','string','max:150'],
            'description_ar' => ['sometimes','nullable','string'],
            'description_fr' => ['sometimes','nullable','string'],
            'icon' => ['sometimes','nullable','string','max:16'],
            'color' => ['sometimes','nullable','string','max:16'],
            'is_active' => ['sometimes','boolean'],
            'display_order' => ['sometimes','nullable','integer','min:0'],
            'professionIds' => ['sometimes','array'],
            'professionIds.*' => ['integer','exists:professions,id'],
        ]);
        $professionIds = $data['professionIds'] ?? null;
        unset($data['professionIds']);
        $category->update($data);
        if (is_array($professionIds)) {
            $category->professions()->sync($professionIds);
        }
        $category->loadCount('professions');
        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(['ok' => true]);
    }

    public function restore($id)
    {
        $c = Category::onlyTrashed()->findOrFail($id);
        $c->restore();
        return response()->json($c);
    }

    public function forceDestroy($id)
    {
        $c = Category::onlyTrashed()->findOrFail($id);
        $c->forceDelete();
        return response()->json(['ok' => true]);
    }
}
