<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('real_name', 30)->nullable()->comment('姓名');
            $table->string('password');
            $table->string('openid',50)->nullable()->comment('微信openid ');
            $table->tinyInteger('sex')->default(0)->comment('性别 默认0保密，1男，2女');
            $table->tinyInteger('type')->default(0)->comment('用户类型 默认0普通用户，1管理员');
            $table->tinyInteger('age')->nullable()->comment('年龄');
            $table->string('img', 255)->nullable()->comment('头像');
            $table->string('address', 100)->nullable()->comment('地址');
            $table->string('email', 50)->nullable()->comment('邮箱');
            $table->string('phone', 20)->nullable()->comment('手机');
            $table->rememberToken();
            $table->softDeletes();
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
        Schema::dropIfExists('users');
    }
}
