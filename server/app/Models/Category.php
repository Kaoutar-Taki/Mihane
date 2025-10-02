<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name_ar', 'name_fr', 'description_ar', 'description_fr', 'icon', 'color', 'is_active', 'display_order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function professions()
    {
        return $this->belongsToMany(Profession::class, 'category_profession');
    }
}
