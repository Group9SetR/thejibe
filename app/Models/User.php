<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use App\Services\TeamWorkApiConsumer;
use DateTime;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract {

    use Authenticatable, CanResetPassword;
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'first_name',
        'last_name',
        'email',
        'username',
        'api_token',
        'company_id',
        'account_id',
        'is_account_owner',
    ];

    /**
     * Relations.
     *
     */
    public function account() {
        return $this->belongsTo('App\Models\Account');        
    }

    /**
     * Methods.
     *
     */
    public function projects() {
        if ($this->is_account_owner) {
            return $this->account->projects();
        }
        
        $teamWorkProjectsIds = [];
        foreach ($this->getTWProjects()['projects'] as $key => $project) {
            $teamWorkProjectsIds[] = $project['id'];
        }
        $account = $this->belongsTo('App\Models\Account','account_id'); 
        return $account->getResults()->hasMany('App\Models\Project')
                ->whereIn('project.id', $teamWorkProjectsIds)
                ->orderBy('project.name');        
    }

    public function companies() {
        if ($this->is_account_owner) {
            return $this->account->companies();
        }
        
        $teamWorkCompaniesIds = [];
        foreach ($this->getTWCompanies()['companies'] as $key => $company) {
            $teamWorkCompaniesIds[] = $company['id'];
        }
        $account = $this->belongsTo('App\Models\Account','account_id'); 
        return $account->getResults()->hasMany('App\Models\Company')
                ->whereIn('company.id', $teamWorkCompaniesIds)
                ->orderBy('company.name');        
    }

    public function getTWProjects() {
        $client = new TeamWorkApiConsumer($this->api_token, $this->account->code);
        return $client->getProjects();        
    }

    public function getTWCompanies() {
        $client = new TeamWorkApiConsumer($this->api_token, $this->account->code);
        return $client->getCompanies();        
    }

    public static function getFromTW($api_token, $subdomain) {
        $client = new TeamWorkApiConsumer($api_token, $subdomain);
        return $client->getMe();  
    }

    public function updateFromTW() {
        $client = new TeamWorkApiConsumer($this->api_token, $this->account->code);
        $teamWorkUser = $client->getMe();
        $attributes = [
            'id' => $teamWorkUser['person']['id'],
            'api_token'     => $this->api_token,
            'company_id'    => $this->account->company_id,   
            'account_id'    => $this->account->id,   
            'first_name'    => $teamWorkUser['person']['first-name'],    
            'last_name'     => $teamWorkUser['person']['last-name'],   
            'username'      => $teamWorkUser['person']['user-name'],   
            'email'         => $teamWorkUser['person']['email-address']
        ];
        return self::update($attributes);
    }

    public static function getOrCreateFromTW($api_token) {
        $user = self::where('api_token', '=' , $api_token)->first();
        if ($user) {
            return $user;
        }
    //  Authenticate and get account from TW
        $teamWorkAccount = Account::getFromTWApiToken($api_token);
        if (!$teamWorkAccount) {
            return false;
        }
    //  Get me    
        $teamWorkUser = self::getFromTW($api_token, $teamWorkAccount['account']['code']);
    //  Account exists localy?
        $account = \App\Models\Account::find($teamWorkAccount['account']['id']);
        if (!$account) {
/*            if (!$teamWorkUser['person']['site-owner']) {
                return false;
            }*/
            $account = \App\Models\Account::create([
                'id'            => $teamWorkAccount['account']['id'],
                'name'          => $teamWorkAccount['account']['name'],
                'url'           => $teamWorkAccount['account']['URL'],
                'code'          => $teamWorkAccount['account']['code'],
                'company_id'    => $teamWorkAccount['account']['companyid'],
            ]);
        }
        
        $teamWorkUser = self::getFromTW($api_token, $account->code);
        if (!$teamWorkUser) {
            return false;
        }
        $user = self::create([
            'id' => $teamWorkUser['person']['id'],
            'api_token'         => $api_token,
            'company_id'        => $account->company_id,   
            'account_id'        => $account->id,   
            'first_name'        => $teamWorkUser['person']['first-name'],    
            'last_name'         => $teamWorkUser['person']['last-name'],   
            'username'          => $teamWorkUser['person']['user-name'],   
            'email'             => $teamWorkUser['person']['email-address'],
            'is_account_owner'  => $teamWorkUser['person']['site-owner'],
        ]);

        /*$teamWorkCompanies = $user->getTWCompanies();
        foreach ($teamWorkCompanies['companies'] as $key => $teamWorkCompany) {
            $company = \App\Models\Company::find($teamWorkCompany['id']);
            if (!$company) {
                $company = \App\Models\Company::create([
                    'id'            => $teamWorkCompany['id'],
                    'name'          => $teamWorkCompany['name'],
                    'account_id'    => $account->id,
                ]);
            }
        }

        $teamWorkProjects = $user->getTWProjects();
        foreach ($teamWorkProjects['projects'] as $key => $teamWorkProject) {
            $project = \App\Models\Project::find($teamWorkProject['id']);
            if (!$project) {
                $project = \App\Models\Project::create([
                    'id'            => $teamWorkProject['id'],
                    'name'          => $teamWorkProject['name'],
                    'description'   => $teamWorkProject['description'],
                    'account_id'    => $account->id,
                    'company_id'    => ($teamWorkProject['company']['id']) ? $teamWorkProject['company']['id'] : null,
                    'category_id'   => ($teamWorkProject['category']['id'] !== '') ? $teamWorkProject['category']['id'] : null,
                    'logo'          => $teamWorkProject['logo'],
                    'start_date'    => date('Y-m-d H:i:s',strtotime($teamWorkProject['startDate'])),
                    'end_date'      => date('Y-m-d H:i:s',strtotime($teamWorkProject['endDate']))
                ]);
                $project->updateTimeTotals();
            }
        }

        $companies = \App\Models\Company::all();
        foreach ($companies as $key => $company) {
            $company->updateTimeTotals();
        }

        $account->setWebhooks();*/

        return $user;
    }
}
