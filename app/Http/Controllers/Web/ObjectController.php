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
        $model = new PlantUser;
        $arr = ['plant_id', 'user_id'];
        $model->setRawAttributes($request->only($arr));
        $model->type = 0;
        if ($model->save()) {
            return response()->json('true');
        } else {
            return response()->json('false');
        }
    }   
}
