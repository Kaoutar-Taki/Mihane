<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CityController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'active');
        $q = City::query()->with('region:id,name_ar,name_fr');

        if ($status === 'archived') {
            $q->onlyTrashed();
        } elseif ($status === 'all') {
            $q->withTrashed();
        }

        return response()->json(
            $q->orderBy('id')->get()
        );
    }

   
    public function store(Request $request)
    {
        $data = $request->validate([
            'name_ar' => ['required','string','max:255'],
            'name_fr' => ['required','string','max:255'],
            'region_id' => ['required','integer','exists:regions,id'],
        ]);

        $city = City::create($data);
        $city->load('region:id,name_ar,name_fr');

        return response()->json($city, Response::HTTP_CREATED);
    }

    public function show(City $city)
    {
        $city->load('region:id,name_ar,name_fr');
        return response()->json($city);
    }

 
    public function update(Request $request, City $city)
    {
        $data = $request->validate([
            'name_ar' => ['sometimes','string','max:255'],
            'name_fr' => ['sometimes','string','max:255'],
            'region_id' => ['sometimes','integer','exists:regions,id'],
        ]);

        $city->update($data);
        $city->load('region:id,name_ar,name_fr');

        return response()->json($city);
    }

    public function destroy(City $city)
    {
        $city->delete();
        return response()->json(['ok' => true]);
    }

    public function restore($id)
    {
        $city = City::onlyTrashed()->findOrFail($id);
        $city->restore();
        $city->load('region:id,name_ar,name_fr');
        return response()->json($city);
    }

    public function forceDestroy($id)
    {
        $city = City::onlyTrashed()->findOrFail($id);
        $city->forceDelete();
        return response()->json(['ok' => true]);
    }
}
