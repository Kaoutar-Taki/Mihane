<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'profile_id','user_id','rating','comment','status','visibility','artisan_response'
    ];

    protected $casts = [
        'artisan_response' => 'array',
    ];

    public function profile() { return $this->belongsTo(ArtisanProfile::class, 'profile_id'); }
    public function user() { return $this->belongsTo(User::class); }
}
