<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlantTabsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plant_tabs', function (Blueprint $table) {
            $prefix = config('database.connections.prefix');
            $table->increments('id');
            $table->integer('plant_id')->unsigned()->comment('盆栽id');
            $table->string('key')->nullable()->comment('键名');
            $table->string('value')->nullable()->comment('键值');
            $table->softDeletes();   //deleted_at字段
            $table->timestamps();
            $table->foreign('plant_id',$prefix.'plant_tabs_plant_id_foreign')->references('id')->on('plants');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('plant_tabs');
    }
}
