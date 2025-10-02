<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ArtisanProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id','profession_id','category_id',
        'title_ar','title_fr','description_ar','description_fr',
        'gallery','social','availability','address_ar','address_fr',
        'visibility','verify_status'
    ];

    protected $casts = [
        'gallery' => 'array',
        'social' => 'array',
        'availability' => 'array',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function profession() { return $this->belongsTo(Profession::class); }
    public function category() { return $this->belongsTo(Category::class); }
}
