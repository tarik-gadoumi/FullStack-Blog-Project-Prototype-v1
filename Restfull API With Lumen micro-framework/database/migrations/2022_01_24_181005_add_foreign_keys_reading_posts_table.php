<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysReadingPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(){
        Schema::table('readings', function(Blueprint $table)
            {
                $table->foreign('owner_id',
                'user_id_reading_foreign')->references('id')->on('users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
                $table->foreign('post_id',
                'post_id_reading_foreign')->references('id')->on('posts')->onUpdate('RESTRICT')->onDelete('RESTRICT');
             });
    }
                /**
                * Reverse the migrations.
                *
                * @return void
                */
    public function down(){
                Schema::table('readings', function(Blueprint $table){
                $table->dropForeign('user_id_reading_foreign');
                $table->dropForeign('post_id_reading_foreign');
            });
    }
}
