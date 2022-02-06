<?php
namespace App\Transformers;
use League\Fractal;
class PostTransformer extends Fractal\TransformerAbstract{
    public function transform(\App\Models\Post $post)
    {       
            return $post->toArray();
    }
}
