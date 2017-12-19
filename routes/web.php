<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('get/openid','WebController@getOpenid'); //获取openid
// 前端路由
Route::group(['prefix' => 'home', 'namespace' => 'Home'], function() {
    Route::get('plant', 'IndexController@getPlant');
    Route::get('operate', 'IndexController@getOperate');
    Route::get('test', 'IndexController@test');
    Route::get('aaa', 'IndexController@aaa');
});
// 后端路由
Route::post('admin/wxlogin', 'Admin\WxController@wxLogin');  //微信登录
Route::group(['prefix' => 'admin', 'namespace' => 'Admin', 'middleware' => 'WxAuth'], function() {
    // 盆栽接口
    Route::resource('plant', 'PlantController');
    Route::post('plant/img', 'PlantController@uploadImg');
});
