<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\User;
use App\Models\Post;


use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
    	return [
    	    'comment'=> $this->faker->text(200),
            'user_id'=>User::all()->random()->id,
            'post_id'=>Post::all()->random()->id,
    	];
    }
}
