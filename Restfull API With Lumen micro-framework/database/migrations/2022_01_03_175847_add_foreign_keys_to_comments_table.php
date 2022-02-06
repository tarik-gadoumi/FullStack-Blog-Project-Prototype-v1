<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('comments', function (Blueprint $table) {

            $table->foreign('post_id', 'post_id_comment_foreign')->references('id')->on('posts')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('post_id', 'post_id_foreign')->references('id')->on('posts')->onUpdate('RESTRICT')->onDelete('RESTRICT');
            $table->foreign('user_id', 'user_id_comment_foreign')->references('id')->on('users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
      
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign('post_id_comment_foreign');
            $table->dropForeign('post_id_foreign');
            $table->dropForeign('user_id_comment_foreign');
        });
    }
}
