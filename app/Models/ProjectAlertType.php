<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\TeamWorkApiConsumer;

class ProjectAlertType extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'project_alert_type';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
        'description',
    ];

    /**
     * Relations.
     *
     */
    public function project_alerts() {
        return $this->hasMany('App\Models\ProjectAlert');        
    }

    /**
     * Methods.
     *
     */
    public static function idFromName($name) {
        return self::where('name',$name)->pluck('id');
    }
}
