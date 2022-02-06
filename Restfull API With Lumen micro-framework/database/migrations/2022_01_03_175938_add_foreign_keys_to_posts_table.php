<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
class AddForeignKeysToPostsTable extends Migration {
/**
* Run the migrations.
*
* @return void
*/
        public function up(){
            Schema::table('posts', function(Blueprint $table)
                {
                    $table->foreign('user_id',
                    'user_id_foreign')->references('id')->on('users')->onUpdate('RESTRICT')->onDelete('RESTRICT');
                 });
        }
                    /**
                    * Reverse the migrations.
                    *
                    * @return void
                    */
        public function down(){
                    Schema::table('posts', function(Blueprint $table){
                    $table->dropForeign('user_id_foreign');
                });
        }
}