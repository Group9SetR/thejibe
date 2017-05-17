<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\ProjectAlert;
use App\Models\ProjectAlertType;

class CompanyController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function show($company_id) {
        $user = \Auth::User();
        $company = $user->companies()->where('company.id', $company_id)->get()->first();
        if (!$company) {
            \App::abort(404, "Company not found");
        }
        $projectAlertTypes = ProjectAlertType::all();
        $data = [
            'user'                  => $user,
            'company'               => $company,
            'projectAlertTypes'     => $projectAlertTypes,
        ];
        return \View::make('companies/show', $data);
    }

    public function update($company_id) {
        $company = Company::find($company_id);
        if (! $company->update(\Input::all())) {
            \App::abort($company->errors()->first());
        }
        return response()->json($company);
    }

    public function getCompany($company_id) {
        return $company = Company::find($company_id);
    }

    public function getProjectAlerts($company_id) {
        $company = Company::find($company_id);
        return $company->project_alerts;        
    }

    public function updateProjectAlert($company_id, $project_alert_id) {
        $company = Company::find($company_id);
        $project_alert = $company->project_alerts()->find($project_alert_id);
        $attributes = \Input::all();
        $attributes['company_id'] = $company_id;
        if (! $project_alert->update(\Input::all())) {
            \App::abort($project_alert->errors()->first());
        }
        return response()->json($project_alert->load('type'));
    }

    public function storeProjectAlert($company_id) {
        $attributes = \Input::all();
        $attributes['company_id'] = $company_id;
        if (! $project_alert = ProjectAlert::create($attributes)) {
            \App::abort($project_alert->errors()->first());
        }
        return response()->json($project_alert->load('type'));
    }

    public function deleteProjectAlert($company_id, $project_alert_id) {
        $company = Company::find($company_id);
        $project_alert = $company->project_alerts()->find($project_alert_id);
        $project_alert->delete();
        return response('Deleted', 200);
    }
}
