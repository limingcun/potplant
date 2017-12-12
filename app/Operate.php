<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Operate extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];  //开启deleted_at
    protected $table='operates';  //绑定operates表
}
