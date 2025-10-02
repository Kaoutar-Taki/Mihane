<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

class UploadController extends Controller
{
    public function uploadImages(Request $request)
    {
        $request->validate([
            'files' => ['required'],
            'files.*' => ['image','mimes:jpeg,jpg,png,webp,gif','max:5120'],
            'folder' => ['nullable','string']
        ]);

        $folder = trim((string) $request->input('folder', 'artisans'), '/');
        $folder = $folder === '' ? 'artisans' : $folder;

        $inputFiles = $request->file('files');
        $files = is_array($inputFiles) ? $inputFiles : [$inputFiles];

        $paths = [];
        foreach ($files as $file) {
            if (!$file) { continue; }
            $stored = $file->store("public/{$folder}");
            $publicUrl = Storage::url($stored);
            $paths[] = $publicUrl;
        }

        return response()->json([
            'paths' => $paths
        ], Response::HTTP_CREATED);
    }
}
