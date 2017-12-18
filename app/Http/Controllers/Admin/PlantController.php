<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Plant;
use IQuery;

class PlantController extends Controller
{
    /*
     * 盆栽列表数据
     * params:[openid:微信id,startDate:开始时间,endDate:结束时间,page:分页]
     */
    public function index(Request $request) {
        $openid = IQuery::cleanInput($request->openid);
        $plant = Plant::join('plant_users','plants.id','=','plant_users.plant_id')
                ->join('users','plant_users.user_id','=','users.id')
                ->where('users.openid',$openid);
        if(isset($request->startDate)) {
            $plant = $plant->where('plants.created_at','>=',$request->startDate);
        } 
        if(isset($request->endDate)) {
            $plant = $plant->where('plants.created_at','<=',$request->endDate);
        }
        $page = IQuery::cleanInput($request->page);
        $page = isset($page) ? $page : '';
        if($page != '') {
            $request->merge(['page'=>$page]);
        }
        $plant = $plant->select('plants.*')->paginate(config('app.page'));
        return response()->json($plant);
    }
    /*
     * 删除盆栽列表数据
     * id:列表id数据
     */
    public function destroy($id) {
        $plant = Plant::find($id);
        if($plant->delete()) {
            return response()->json('true');
        } else {
            return response()->json('false');
        }
    }
}