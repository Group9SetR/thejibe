<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\TeamWorkApiConsumer;

class ProjectAlert extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'project_alert';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'project_alert_type_id',
        'project_id',
        'company_id',
        'amount',
        'amount_type',
        'hours_type',
        'created_by',
        'notified',
        'emails',
    ];

    /**
     * Relations.
     *
     */
    public function projects() {
        if ($this->project_id) {
            return $this->belongsTo('App\Models\Project', 'project_id');        
        } elseif ($this->company_id) {
            $company = $this->belongsTo('App\Models\Company','company_id'); 
            return    $company->getResults()->hasMany('App\Models\Project'); 
        }
    }

    public function company() {
        return $this->belongsTo('App\Models\Company');        
    }    

    public function created_by() {
        return $this->belongsTo('App\Models\User', 'created_by');        
    }

    public function type() {
        return $this->belongsTo('App\Models\ProjectAlertType', 'project_alert_type_id');        
    }

    /**
     * Methods.
     *
     */
    public function check() {
        if ($this->notified) {
            return;
        }
        $type = $this->type;
        $projects = $this->projects;
        $company = $this->company;
        $limitReached = false;
        $range_sufix = '';
        switch ($type->name) {
            case 'Weekly': $range_sufix = '_weekly'; break;
            case 'Monthly': $range_sufix = '_monthly'; break;
            case 'Yearly': $range_sufix = '_yearly'; break;
        }
        $hoursField = $this->hours_type.'_hours_sum'.$range_sufix;
        switch ($this->amount_type) {
            case 'hours':
                if ($company) {
                    if ($company->{$hoursField} >= $this->amount) $limitReached = true;
                } else {
                    if ($projects->{$hoursField} >= $this->amount) $limitReached = true;
                }
                break;
            case 'percentage':
                if ($company) {
                    if ($company->{$hoursField} >= ($this->project->total_hours * $this->amount / 100)) $limitReached = true;  
                } else {
                    if ($projects->{$hoursField} >= ($this->project->total_hours * $this->amount / 100)) $limitReached = true;                   
                }
                break;                    
        }
        if ($limitReached) $this->notify();
    }

    private function notify() {
        $this->send_email_notification();
        $this->update(['notified' => true]);
    }

    private function send_email_notification() {
        $data = [
            'project_alert' => $this
        ];
        $toEmails = explode(',', $this->emails);
        \Mail::send('emails.project_alert', $data, function ($message) use($data, $toEmails) {
            $name = "";
            if ($data['project_alert']->company) {
                $name = $data['project_alert']->company->name;
            } else {
                $name = $data['project_alert']->projects->name;
            }
            $message->subject('Limit reached on "'. $name . '"');
            $message->from('jibeteamwork@gmail.com', 'TeamWork Alerts');

            $message->to($toEmails);
        });
        \Log::info('Limit reached for id:'.$this->id);
    }

   
}
