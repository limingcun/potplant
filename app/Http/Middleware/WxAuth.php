<?php
/**
 * auther:李明村
 * date: 2017/12/12
 */
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Model\User;
use Session;
use IQuery;
/*
 * 401 deadline 过期时间
 * 402 expired 登录权限
 * 403 notlogin 没有登录
 */
class WxAuth {
    // 微信用户登录及权限 中间件
    public function handle($request, Closure $next) {
        // 微信登录状态判断
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
        return $next($request);
    }
}
