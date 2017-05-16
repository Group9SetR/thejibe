<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\TeamWorkApiConsumer;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model {

    use SoftDeletes;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'project';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
        'description',
        'account_id',
        'company_id',
        'category_id',
        'logo',
        'start_date',
        'end_date',
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

    public function company() {
        return $this->belongsTo('App\Models\Company');        
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
        $teamWorkProject = $client->getProject($id);
        $attributes = [
                'id'            => $teamWorkProject['project']['id'],
                'name'          => $teamWorkProject['project']['name'],
                'description'   => $teamWorkProject['project']['description'],
                'account_id'    => $user->account->id,
                'company_id'    => ($teamWorkProject['project']['company']['id']) ? $teamWorkProject['project']['company']['id'] : null,
                'category_id'   => ($teamWorkProject['project']['category']['id'] !== '') ? $teamWorkProject['project']['category']['id'] : null,
                'logo'          => $teamWorkProject['project']['logo'],
                'start_date'    => date('Y-m-d H:i:s',strtotime($teamWorkProject['project']['startDate'])),
                'end_date'      => date('Y-m-d H:i:s',strtotime($teamWorkProject['project']['endDate']))
        ];
        $project = self::find($id);
        if (!$project) {
            $project = \App\Models\Project::create($attributes);
        } else {
            $project->update($attributes);            
        }
        return $project;      
    }

    public function updateFromTW() {
        $client = new TeamWorkApiConsumer($this->account->owner->api_token, $this->account->code);
        $teamWorkProject = $client->getProject($this->id);
        $attributes = [
                'id'            => $teamWorkProject['project']['id'],
                'name'          => $teamWorkProject['project']['name'],
                'description'   => $teamWorkProject['project']['description'],
                'account_id'    => $this->account->id,
                'company_id'    => $teamWorkProject['project']['company']['id'],
                'category_id'   => $teamWorkProject['project']['category']['id'],
                'logo'          => $teamWorkProject['project']['logo'],
                'start_date'    => date('Y-m-d H:i:s',strtotime($teamWorkProject['project']['startDate'])),
                'end_date'      => date('Y-m-d H:i:s',strtotime($teamWorkProject['project']['endDate']))
        ];
        return self::update($attributes);
    }

    public static function getFromTWId($id, $user = null) {
        if (! $user) $user = \Auth::User();
        $client = new TeamWorkApiConsumer($user->api_token, $user->account->code);
        return $client->getProject($id);
    }

    public function getCompany() {
        $user = \Auth::User();
        if (!$user) $user = $this->account->owner;
        return \App\Models\Company::getFromTWId($this->company_id, $user);
    }

    public function getRates() {
        $user = \Auth::User();
        if (!$user) $user = $this->account->owner;
        $client = new TeamWorkApiConsumer($user->api_token, $user->account->code);
        return $client->getProjectRates($this->id);    }

    public function getCategory() {
        $user = \Auth::User();
        if (!$user) $user = $this->account->owner;
        return \App\Models\ProjectCategory::getFromTWId($this->category_id, $user);
    }

    public function getTimeTotals() {
        $user = \Auth::User();
        if (!$user) $user = $this->account->owner;

        $client = new TeamWorkApiConsumer($user->api_token, $user->account->code);
        return [
            'total'     => $client->getProjectTimeTotals($this->id, []),
            'weekly'    => $client->getProjectTimeTotals($this->id, ['fromDate' => date('Ymd',strtotime('Monday this week'))]),
            'monthly'   => $client->getProjectTimeTotals($this->id, ['fromDate' => date('Ym').'01']),
            'yearly'    => $client->getProjectTimeTotals($this->id, ['fromDate' => date('Y').'0101']),
        ];
    }

    public function updateTimeTotals() {
        $timeTotals = $this->getTimeTotals();
        $attributes = [
        //  Total
            'billable_hours_sum' => $timeTotals['total']['projects'][0]['time-totals']['billable-hours-sum'],
            'non_billable_hours_sum' => $timeTotals['total']['projects'][0]['time-totals']['non-billable-hours-sum'],
            'total_hours_sum' => $timeTotals['total']['projects'][0]['time-totals']['total-hours-sum'],
        //  Weekly
            'billable_hours_sum_weekly' => $timeTotals['weekly']['projects'][0]['time-totals']['billable-hours-sum'],
            'non_billable_hours_sum_weekly' => $timeTotals['weekly']['projects'][0]['time-totals']['non-billable-hours-sum'],
            'total_hours_sum_weekly' => $timeTotals['weekly']['projects'][0]['time-totals']['total-hours-sum'],
        //  Monthly
            'billable_hours_sum_monthly' => $timeTotals['monthly']['projects'][0]['time-totals']['billable-hours-sum'],
            'non_billable_hours_sum_monthly' => $timeTotals['monthly']['projects'][0]['time-totals']['non-billable-hours-sum'],
            'total_hours_sum_monthly' => $timeTotals['monthly']['projects'][0]['time-totals']['total-hours-sum'],
        //  Yearly
            'billable_hours_sum_yearly' => $timeTotals['yearly']['projects'][0]['time-totals']['billable-hours-sum'],
            'non_billable_hours_sum_yearly' => $timeTotals['yearly']['projects'][0]['time-totals']['non-billable-hours-sum'],
            'total_hours_sum_yearly' => $timeTotals['yearly']['projects'][0]['time-totals']['total-hours-sum'],
        ];
        return $this->update($attributes);
    }
}
