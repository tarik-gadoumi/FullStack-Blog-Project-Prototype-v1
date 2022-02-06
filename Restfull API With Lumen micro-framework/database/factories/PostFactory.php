<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition()
    {
    	return [
            
                'content' => $this->faker->paragraph(1000),
                'title' => $this->faker->sentence(),
                'author'=>$this->faker->name(),
                'coverImageUrl'=> "https://images-na.ssl-images-amazon.com/images/I/41JodZ5Vl%2BL.jpg",
                'status'=>'published',
                'user_id'=>User::all()->random()->id,
              
            
    	];
    }
}
