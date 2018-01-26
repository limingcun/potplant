<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\PlantUser;
use IQuery;
use App\User;
class AuthController extends Controller
{
    /*
     * 判断是否登录
     * openid 微信id
     */
    public function checkLogin(Request $request) {
        $st = IQuery::redisGet('st_'.$request->openid);
        $user = User::where('openid',$request->openid)->select('real_name', 'apply_state', 'type')->first();
        if (!isset($user)) {
            return response()->json('notapply', 400);
        }
        if (isset($st)) {
            if (!isset($request->st)) {
                return response()->json($user->apply_state, 402);
            } else if($request->st != $st) {
                return response()->json($user->apply_state, 403);
            }
        } else {
            return response()->json($user->apply_state, 401);
        }
        return response()->json($user); 
    }
    /*
     * 微信登录
     * openid 微信id
     */
    public function wxLogin(Request $request) {
        $user = User::where('openid','=',$request->openid)->first();
        if (isset($user)) {
            if ($user->apply_state==1) {
                $st = 'wx_login_'.$this->createRandomStr(32); //随机生成32个字符串
                IQuery::redisSet('st_'.$request->openid, $st, 3600 * 24);  //使用redis设置过期时间缓存，时间为24小时
                $user->st = $st;
                return response()->json($user);
            } else {
                return response()->json('error');
            }
        } else {
            return response()->json('false');
        }
    }
    /*
     * 随机生成字符串
     * $length为字符串长度
     */
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
    
    /*
     * 提交申请管理
     */
    public function applyFor(Request $request) {
        $data['name'] = $this->createRandomStr(10);
        $data['img'] = $request->img;
        $data['type'] = 0;
        $data['real_name'] = $request->real_name;
        $data['sex'] = $request->sex;
        $data['phone'] = $request->phone;
        $data['email'] = $request->email;
        $data['address'] = $request->address;
        $data['openid'] = $request->openid;
        $data['password'] = bcrypt('000000');
        $result = User::create($data);
        if ($result) {
            return response()->json('true');
        } else {
            return response()->json('false');
        }
    }
}
