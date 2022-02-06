<?php
namespace App\Transformers;
use League\Fractal;
class CommentTransformer extends Fractal\TransformerAbstract{
    public function transform(\App\Models\Comment $comment)
    {       
            return $comment->toArray();
    }
}
