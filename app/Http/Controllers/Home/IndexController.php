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
        $plant_user = PlantUser::where('plant_id', $plant_id)->select('user_id','type')->get();
        return response()->json($plant_user);
    }
}
