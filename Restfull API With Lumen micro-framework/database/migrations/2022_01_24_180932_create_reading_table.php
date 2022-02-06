<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReadingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('readings', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('owner_id')->index('user_id_reading_foreign');
            $table->integer('post_id')->index('post_id_reading_foreign');
            $table->integer('rating')->default('0');
            $table->text('post',65535)->nullable();
            $table->bigInteger('startDate')->nullable();
            $table->bigInteger('finishDate')->nullable();
            $table->text('notes', 65535)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('readings');
    }
}
