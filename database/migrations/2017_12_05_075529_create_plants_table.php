<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plants', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',50)->comment('盆栽品种名称');   //盆栽品种名称
            $table->text('img')->nullable()->comment('品种图片');   //品种图片
            $table->text('intro')->nullable()->comment('介绍');   //介绍
            $table->text('memo')->nullable()->comment('其他信息');   //其他信息
            $table->softDeletes();   //deleted_at字段
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
        Schema::dropIfExists('plants');
    }
}
