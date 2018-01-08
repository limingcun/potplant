<?php

namespace App\Http\Controllers\Home;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Plant;
use App\PlantTab;
use App\Operate;
use App\PlantUser;
use IQuery;
use Session;
use App\User;
class IndexController extends Controller
{
    /**
     * Display a listing of the resource.
     * 获取盆栽数据信息
     * @return \Illuminate\Http\Response
     */
    public function getPlant(Request $request)
    {
        $id = IQuery::cleanInput($request->id);
        $plant = Plant::find($id);
        $plantTab = PlantTab::where('plant_id',$id)->get();
        return response()->json([
                'plant' => $plant,
                'plantTab' => $plantTab
            ]
        );
    }

    /**
     * Display a listing of the resource.
     * 获取操作数据信息
     * @return \Illuminate\Http\Response
     */
    public function getOperate(Request $request)
    {
        $plant_id = IQuery::cleanInput($request->id);
        $type = IQuery::cleanInput($request->type);
        $operate = Operate::where('plant_id', $plant_id)->where('type',$type)->get();
        return response()->json($operate);
    }
    
    /**
     * Display a listing of the resource.
     * 获取管理员数据信息
     * @return \Illuminate\Http\Response
     */
    public function getMange(Request $request)
    {
        $plant_id = IQuery::cleanInput($request->id);
        $plant_user = PlantUser::join('users', 'plant_users.user_id','=','users.id')
                    ->whereNull('users.deleted_at')
                    ->where('plant_id', $plant_id)->select('users.id','users.real_name','users.img','users.sex','users.age','users.phone',
                            'users.email','users.address','plant_users.type')->get();
        return response()->json($plant_user);
    }
    
    /**
     * Display a listing of the resource.
     * 查看是否管理员
     * @return \Illuminate\Http\Response
     */
    public function lookCheck(Request $request)
    {
        $plant_id = IQuery::cleanInput($request->id);
        $openid = $request->openid;
        $data = User::join('plant_users', 'users.id', 'plant_users.user_id')
                     ->whereNull('plant_users.deleted_at')
                     ->where('plant_users.plant_id', $plant_id)
                     ->where('users.openid',$openid)
                     ->first();
        if(isset($data)) {
            return response()->json('true');
        } else {
            return response()->json('false');
        }
    }
    /**
     * Display a listing of the resource.
     * 获取所有盆栽数据信息
     * @return \Illuminate\Http\Response
     */
    public function getPlantList(Request $request) {
        $plant = Plant::join('plant_users','plants.id','=','plant_users.plant_id')
                      ->join('users','plant_users.user_id','=','users.id')
                      ->where('plant_users.deleted_at')
                      ->where('plant_users.type', '=', 1)
                      ->where('users.deleted_at');
        $page = IQuery::cleanInput($request->page);
        $page = isset($page) ? $page : '';
        if($page != '') {
            $request->merge(['page'=>$page]);
        }
        $plant = $plant->select('plants.id','plants.name','plants.img','users.real_name')
                      ->orderBy('plants.id','desc')->paginate(config('app.page'));
        return response()->json($plant);
    }
}
