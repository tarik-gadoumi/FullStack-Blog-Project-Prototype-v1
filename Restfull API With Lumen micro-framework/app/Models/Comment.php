<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Comment extends Model
{   
    use HasFactory;

    protected $fillable = ['comment', 'user_id', 'post_id'];    
    
    public function post(){
        return $this->belongsTo("\App\Models\Post");
        }
    public function user(){
        return $this->belongsTo("\App\Models\User");
        }
}
