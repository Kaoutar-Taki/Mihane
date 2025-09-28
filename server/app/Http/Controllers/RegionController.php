<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RegionController extends Controller
{
    public function index()
    {
        return response()->json(Region::orderBy('id')->get());
    }

    public function show(Region $region)
    {
        return response()->json($region);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_ar' => ['required','string','max:255'],
            'name_fr' => ['required','string','max:255'],
        ]);
        $region = Region::create($data);
        return response()->json($region, Response::HTTP_CREATED);
    }

    public function update(Request $request, Region $region)
    {
        $data = $request->validate([
            'name_ar' => ['sometimes','required','string','max:255'],
            'name_fr' => ['sometimes','required','string','max:255'],
        ]);
        $region->update($data);
        return response()->json($region);
    }

    public function destroy(Region $region)
    {
        $region->delete();
        return response()->json(['ok' => true]);
    }
}
