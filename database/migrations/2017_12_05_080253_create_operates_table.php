<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOperatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('operates', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('plant_id')->unsigned()->comment('盆栽id');
            $table->datetime('datetime')->comment('时间');
            $table->string('img',255)->nullable()->comment('图片');
            $table->string('way',255)->nullable()->comment('方式');
            $table->string('amount',255)->nullable()->comment('使用量');
            $table->string('type',255)->nullable()->comment('操作类型');
            $table->string('name',255)->nullable()->comment('其他类名称');
            $table->string('memo',255)->nullable()->comment('其他信息');
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
        Schema::dropIfExists('operates');
    }
}
