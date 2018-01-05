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
     */
    public function checkLogin(Request $request) {
        $st = IQuery::redisGet('st_'.$request->openid);
        if (isset($st)) {
            if (!isset($request->st)) {
                return response()->json('notlogin', 402);
            } else if($request->st != $st) {
                return response()->json('expired', 403);
            }
        } else {
            return response()->json('deadline', 401);
        }
        $user = User::where('openid',$request->openid)->select('real_name')->first();
        return response()->json($user); 
    }   
}
