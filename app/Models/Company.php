<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\TeamWorkApiConsumer;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'company';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
        'account_id',
        'total_hours',
        'billable_hours_sum',
        'non_billable_hours_sum',
        'total_hours_sum',
        'billable_hours_sum_weekly',
        'non_billable_hours_sum_weekly',
        'total_hours_sum_weekly',
        'billable_hours_sum_monthly',
        'non_billable_hours_sum_monthly',
        'total_hours_sum_monthly',
        'billable_hours_sum_yearly',
        'non_billable_hours_sum_yearly',
        'total_hours_sum_yearly',
    ];

    /**
     * Relations.
     *
     */
    public function account() {
        return $this->belongsTo('App\Models\Account');        
    }

    public function projects($user = null) {
        $projects = $this->hasMany('App\Models\Project')->orderBy('project.name');   
        if ($user) {
            $projectsIds = $user->projects->lists('id');
            $projects = $projects->whereIn('project.id', $projectsIds); 
        }
        return $projects;   
    }

    public function project_alerts() {
        return $this->hasMany('App\Models\ProjectAlert');        
    }

    public function users() {
        return $this->account->users();
    }

    /**
     * Methods.
     *
     */

    public static function updateOrCreateFromTWId($id, $user = null) {
        if (! $user) $user = \Auth::User();
        $client = new TeamWorkApiConsumer($user->api_token, $user->account->code);
        $teamWorkProject = $client->getCompany($id);
        $attributes = [
                'id'            => $teamWorkProject['company']['id'],
                'name'          => $teamWorkProject['company']['name'],
                'account_id'    => $user->account->id,
        ];
        $company = self::find($id);
        if (!$company) {
            $company = \App\Models\Company::create($attributes);
        } else {
            $company->update($attributes);            
        }
        return $company;      
    }

    public static function getFromTWId($id, $user = null) {
        if (! $user) $user = \Auth::User();
        $client = new TeamWorkApiConsumer($user->api_token, $user->account->code);
        return $client->getCompany($id);
    }

    public static function getAllFromTW($user = null) {
        if (! $user) $user = \Auth::User();
        $client = new TeamWorkApiConsumer($user->api_token, $user->account->code);
        return $client->getCompanies();
    }

    public function updateTimeTotals() {
        $attributes = [
        //  Total
            'billable_hours_sum' => 0,
            'non_billable_hours_sum' => 0,
            'total_hours_sum' => 0,
        //  Weekly
            'billable_hours_sum_weekly' => 0,
            'non_billable_hours_sum_weekly' => 0,
            'total_hours_sum_weekly' => 0,
        //  Monthly
            'billable_hours_sum_monthly' => 0,
            'non_billable_hours_sum_monthly' => 0,
            'total_hours_sum_monthly' => 0,
        //  Yearly
            'billable_hours_sum_yearly' => 0,
            'non_billable_hours_sum_yearly' => 0,
            'total_hours_sum_yearly' => 0,
        ];

        foreach ($this->projects as $key => $project) {
            $timeTotals = $project->getTimeTotals();
            //  Total
            $attributes['billable_hours_sum'] += $timeTotals['total']['projects'][0]['time-totals']['billable-hours-sum'];
            $attributes['non_billable_hours_sum'] += $timeTotals['total']['projects'][0]['time-totals']['non-billable-hours-sum'];
            $attributes['total_hours_sum'] += $timeTotals['total']['projects'][0]['time-totals']['total-hours-sum'];
            //  Weekly
            $attributes['billable_hours_sum_weekly'] += $timeTotals['weekly']['projects'][0]['time-totals']['billable-hours-sum'];
            $attributes['non_billable_hours_sum_weekly'] += $timeTotals['weekly']['projects'][0]['time-totals']['non-billable-hours-sum'];
            $attributes['total_hours_sum_weekly'] += $timeTotals['weekly']['projects'][0]['time-totals']['total-hours-sum'];
            //  Monthly
            $attributes['billable_hours_sum_monthly'] += $timeTotals['monthly']['projects'][0]['time-totals']['billable-hours-sum'];
            $attributes['non_billable_hours_sum_monthly'] += $timeTotals['monthly']['projects'][0]['time-totals']['non-billable-hours-sum'];
            $attributes['total_hours_sum_monthly'] += $timeTotals['monthly']['projects'][0]['time-totals']['total-hours-sum'];
            //  Yearly
            $attributes['billable_hours_sum_yearly'] += $timeTotals['yearly']['projects'][0]['time-totals']['billable-hours-sum'];
            $attributes['non_billable_hours_sum_yearly'] += $timeTotals['yearly']['projects'][0]['time-totals']['non-billable-hours-sum'];
            $attributes['total_hours_sum_yearly'] += $timeTotals['yearly']['projects'][0]['time-totals']['total-hours-sum'];
        }

        return $this->update($attributes);
    }
}
