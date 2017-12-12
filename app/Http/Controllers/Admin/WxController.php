<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use IQuery;
use Redirect;
use Session;

class WxController extends Controller
{
    // 微信直接登陆
    public function wxLogin(Request $request) {
        $user = User::where('openid','=',$request->openid)->first();
        if ($user != null) {
            $user->img = $request->img;
            $user->openid = $request->openid;
            if (!$user->save()) return 500;
            $st = 'wx_login_'.$this->createRandomStr(32);
            Session::put('st', $st);
            $user->st = $st;
            return $user;
        } else {
            $data['name'] = $this->createRandomStr(10);
            $data['img'] = $request->img;
            $data['type'] = 0;
            $data['real_name'] = $request->real_name; 
            $data['sex'] = $request->sex;
            $data['openid'] = $request->openid;
            $data['password'] = bcrypt('000000');
            $result = User::create($data);
            $st = 'wx_login_'.$this->createRandomStr(32);
            Session::put('st', $st);
            $user->st = $st;
            return $result;
        }
    }

 
    // 随机字符串生成
    public function createRandomStr($length){ 
        $str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';//62个字符 
        $strlen = 62; 
        while($length > $strlen) {
            $str .= $str; 
            $strlen += 62; 
        } 
        $str = str_shuffle($str); 
        return substr($str,0,$length); 
    } 
}