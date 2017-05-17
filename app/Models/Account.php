<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\TeamWorkApiConsumer;

class Account extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'account';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
        'url',
        'code',
        'company_id',
        'owner_id',
    ];

    /**
     * Relations.
     *
     */
    public function users() {
        return $this->hasMany('App\Models\User');
    }

    public function owner() {
        return $this->hasOne('App\Models\User')->where('is_account_owner',true);
    }

    public function companies() {
        return $this->hasMany('App\Models\Company')->orderBy('company.name');
    }

    public function projects() {
        return $this->hasMany('App\Models\Project')->orderBy('project.name');
    }

    /**
     * Methods.
     *
     */
    public static function getFromTWApiToken($api_token) {
        $client = new TeamWorkApiConsumer($api_token);
        return $client->authenticate();
    }    

    public function getCompany() {
        $user = \Auth::User();
        if (!$user) {
            $user = $this->owner;
        }
        return \App\Models\Company::getFromTWId($this->company_id, $user);
    }

    public function setWebhooks() {
        $user = \Auth::User();
        if (!$user) {
            $user = $this->owner;
        }
        $listenerUrl = env('APP_URL').'/api/v1/listener';
        $client = new TeamWorkApiConsumer($user->api_token, $this->code);
        $webhooks = $client->getWebhooks();
        $data = [
            'webhook' => [
                'status'    => 'ACTIVE',
                'url'       => $listenerUrl, 
            ]
        ];
        $eventsList = [
            'PROJECT.ARCHIVED',
            'PROJECT.CREATED',
            'PROJECT.DELETED',
            'PROJECT.REOPENED',
            'PROJECT.UPDATED',
            'COMPANY.CREATED',
            'COMPANY.DELETED',
            'COMPANY.UPDATED',
            'TIME.CREATED',
            'TIME.UPDATED',
            'TIME.DELETED',
        ];
        if (isset($webhooks['webhooks'])) {
            foreach ($webhooks['webhooks'] as $webhook) {
                foreach ($eventsList as $key => $event) {
                    if ($webhook['event'] == $event) {
                        $client->deleteWebhook(['webhook' => $webhook]);
                    } 
                }                
            }
        }
        foreach ($eventsList as $key => $event) {
            $data['webhook']['event'] = $event;
            $client->postWebhook($data);
        }
        
        $client->enableWebhooks();

        return $this;

    }

    public function sync() {
        $teamWorkCompanies = $this->owner->getTWCompanies();
        foreach ($teamWorkCompanies['companies'] as $key => $teamWorkCompany) {
            $company = \App\Models\Company::find($teamWorkCompany['id']);
            if (!$company) {
                $company = \App\Models\Company::create([
                    'id'            => $teamWorkCompany['id'],
                    'name'          => $teamWorkCompany['name'],
                    'account_id'    => $this->id,
                ]);
            }
        }

        $teamWorkProjects = $this->owner->getTWProjects();
        foreach ($teamWorkProjects['projects'] as $key => $teamWorkProject) {
            $project = \App\Models\Project::find($teamWorkProject['id']);
            if (!$project) {
                $project = \App\Models\Project::create([
                    'id'            => $teamWorkProject['id'],
                    'name'          => $teamWorkProject['name'],
                    'description'   => $teamWorkProject['description'],
                    'account_id'    => $this->id,
                    'company_id'    => ($teamWorkProject['company']['id']) ? $teamWorkProject['company']['id'] : null,
                    'category_id'   => ($teamWorkProject['category']['id'] !== '') ? $teamWorkProject['category']['id'] : null,
                    'logo'          => $teamWorkProject['logo'],
                    'start_date'    => date('Y-m-d H:i:s',strtotime($teamWorkProject['startDate'])),
                    'end_date'      => date('Y-m-d H:i:s',strtotime($teamWorkProject['endDate']))
                ]);
            }
        }

        $companies = \App\Models\Company::all();
        foreach ($companies as $key => $company) {
            $company->updateTimeTotals();
        }

        $projects = \App\Models\Project::all();
        foreach ($projects as $key => $project) {
            $project->updateTimeTotals();
        }

        $this->setWebhooks();        
    }
}
