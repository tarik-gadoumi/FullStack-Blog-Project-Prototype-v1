<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reading extends Model
{
    use HasFactory;
    
     protected $fillable = ['owner_id','post_id','notes','post','startDate','finishDate','rating'];

    public function posts(){
        return $this->hasMany('App\Models\Post');
    }

    public function user(){
        return $this->belongsTo('App\Models\User');
    }
}
