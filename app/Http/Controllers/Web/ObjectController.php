<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\PlantUser;
use IQuery;
class ObjectController extends Controller
{
    /*
     * 邀请合作伙伴
     */
    public function getInvit(Request $request) {
        $plant_id = IQuery::cleanInput($request->plant_id);
        $user_id = IQuery::cleanInput($request->user_id);
        $plant_user = PlantUser::where('plant_id',$plant_id)->where('user_id',$user_id)->first();
        if(!isset($plant_user)) {
            $model = new PlantUser;
            $arr = ['plant_id', 'user_id'];
            $model->setRawAttributes($request->only($arr));
            $model->type = 0;
            if ($model->save()) {
                return response()->json('true');
            } else {
                return response()->json('false');
            }
        } else {
            return response()->json('true');
        }
    }   
}
