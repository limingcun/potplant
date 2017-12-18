<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Plant;
use IQuery;

class PlantController extends Controller
{
    public function index(Request $request) {
        $openid = IQuery::cleanInput($request->openid);
        $plant = Plant::join('plant_users','plants.id','=','plant_users.plant_id')
                ->where('users','plant_users.user_id','=','users.id')
                ->where('users.openid',$openid)->get();
        return response()->json($plant);
    }
}