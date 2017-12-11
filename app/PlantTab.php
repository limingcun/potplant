<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlantTab extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];  //开启deleted_at
    protected $table='plant_tabs';  //绑定plant_tabs表
}
