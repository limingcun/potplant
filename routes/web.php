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
Route::get('set/qrcode','WebController@setQrcode'); //获取二维码
// 前端路由
Route::group(['prefix' => 'home', 'namespace' => 'Home'], function() {
    Route::get('plant', 'IndexController@getPlant');
    Route::get('operate', 'IndexController@getOperate');
    Route::get('mange', 'IndexController@getMange');
    Route::get('look/check', 'IndexController@lookCheck');
    Route::get('list', 'IndexController@getPlantList');
});
// 后端路由
Route::post('admin/wxlogin', 'Admin\WxController@wxLogin');  //微信登录
Route::group(['prefix' => 'admin', 'namespace' => 'Admin', 'middleware' => 'WxAuth'], function() {
    // 盆栽接口
    Route::resource('plant', 'PlantController');
    Route::post('plant/img', 'PlantController@uploadImg');
    // 盆栽操作接口
    Route::resource('operate', 'OperateController');
    Route::post('operate/img', 'OperateController@uploadImg');
    // 管理员接口
    Route::resource('mange', 'MangeController');
    Route::post('mange/img', 'MangeController@uploadImg');
});
//其他操作
Route::group(['prefix' => 'web', 'namespace' => 'Web'], function() {
    Route::get('invit', 'ObjectController@getInvit');
    // 判断是否登录
    Route::get('clg','AuthController@checkLogin');
    // 微信登录
    Route::get('wxlogin','AuthController@wxLogin');
    // 提交申请
    Route::post('apply','AuthController@applyFor');
    Route::get('apply-list','AuthController@applyList')->middleware('WxAuth');
});
