<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'active');
        $q = Faq::query();
        if ($status === 'archived') {
            $q->onlyTrashed();
        } elseif ($status === 'all') {
            $q->withTrashed();
        }
        return response()->json($q->orderBy('priority')->orderBy('id')->get());
    }

    public function show(Faq $faq)
    {
        return response()->json($faq);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'priority' => ['required','integer','min:1'],
            'is_active' => ['boolean'],
            'question_ar' => ['required','string','max:255'],
            'question_fr' => ['required','string','max:255'],
            'answer_ar' => ['required','string'],
            'answer_fr' => ['required','string'],
        ]);
        $faq = Faq::create($data);
        return response()->json($faq, Response::HTTP_CREATED);
    }

    public function update(Request $request, Faq $faq)
    {
        $data = $request->validate([
            'priority' => ['sometimes','integer','min:1'],
            'is_active' => ['sometimes','boolean'],
            'question_ar' => ['sometimes','string','max:255'],
            'question_fr' => ['sometimes','string','max:255'],
            'answer_ar' => ['sometimes','string'],
            'answer_fr' => ['sometimes','string'],
        ]);
        $faq->update($data);
        return response()->json($faq);
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();
        return response()->json(['ok' => true]);
    }

    public function restore($id)
    {
        $f = Faq::onlyTrashed()->findOrFail($id);
        $f->restore();
        return response()->json($f);
    }

    public function forceDestroy($id)
    {
        $f = Faq::onlyTrashed()->findOrFail($id);
        $f->forceDelete();
        return response()->json(['ok' => true]);
    }
}
