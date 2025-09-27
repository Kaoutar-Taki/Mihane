<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes','string','max:255'],
            'name_ar' => ['sometimes','nullable','string','max:255'],
            'email' => ['sometimes','email','max:255', Rule::unique('users','email')->ignore($user->id)],
            'phone' => ['nullable','string','max:50'],
            'bio' => ['nullable','string','max:5000'],
            'bio_ar' => ['nullable','string','max:5000'],
            'gender_id' => ['nullable','integer','exists:genders,id'],
            'avatar' => ['nullable'],
            'avatarFile' => ['sometimes','file','image','max:2048'],
        ]);

        $user->fill(collect($validated)->except(['avatarFile'])->toArray());

        if ($request->hasFile('avatarFile')) {
            $path = $request->file('avatarFile')->store('avatars', 'public');
            $user->avatar = Storage::url($path);
        }
        $user->save();

        return response()->json($user);
    }
}
