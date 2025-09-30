<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'active');
        $q = User::query();
        if ($status === 'archived') {
            $q->onlyTrashed();
        } elseif ($status === 'all') {
            $q->withTrashed();
        }
        $q->orderBy('id');
        return response()->json($q->get(['id','name','name_ar','email','role','phone','avatar','deleted_at','created_at','updated_at']));
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'name_ar' => ['nullable','string','max:255'],
            'email' => ['required','email','max:255','unique:users,email'],
            'password' => ['required','string','min:6'],
            'role' => ['required','in:SUPER_ADMIN,ADMIN,ARTISAN,CLIENT'],
            'phone' => ['nullable','string','max:50'],
        ]);
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);
        return response()->json($user, Response::HTTP_CREATED);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['sometimes','string','max:255'],
            'name_ar' => ['sometimes','nullable','string','max:255'],
            'email' => ['sometimes','email','max:255','unique:users,email,'.$user->id],
            'password' => ['sometimes','nullable','string','min:6'],
            'role' => ['sometimes','in:SUPER_ADMIN,ADMIN,ARTISAN,CLIENT'],
            'phone' => ['sometimes','nullable','string','max:50'],
        ]);
        if (array_key_exists('password', $data) && $data['password']) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }
        $user->update($data);
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['ok' => true]);
    }

    public function restore($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();
        return response()->json($user);
    }

    public function forceDestroy($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->forceDelete();
        return response()->json(['ok' => true]);
    }
}
