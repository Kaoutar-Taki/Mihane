<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $fillable = ['nom', 'telephone', 'email', 'site', 'reseaux', 'notes'];
}
