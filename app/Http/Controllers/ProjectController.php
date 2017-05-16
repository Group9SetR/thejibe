<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectAlert;
use App\Models\ProjectAlertType;

class ProjectController extends Controller
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

    public function show($project_id) {
        $user = \Auth::User();
        $project = $user->projects()->where('project.id', $project_id)->get()->first();
        if (!$project) {
            \App::abort(404, "Project not found");
        }
        $projectAlertTypes = ProjectAlertType::all();
        $data = [
            'user'                  => $user,
            'project'               => $project,
            'projectAlertTypes'     => $projectAlertTypes,
        ];
        return \View::make('projects/show', $data);
    }

    public function update($project_id) {
        $project = Project::find($project_id);
        if (! $project->update(\Input::all())) {
            \App::abort($project->errors()->first());
        }
        return response()->json($project);
    }

    public function getProject($project_id) {
        return $project = Project::find($project_id);
    }

    public function getProjectAlerts($project_id) {
        $project = Project::find($project_id);
        return $project->project_alerts;        
    }

    public function updateProjectAlert($project_id, $project_alert_id) {
        $project = Project::find($project_id);
        $project_alert = $project->project_alerts()->find($project_alert_id);
        $attributes = \Input::all();
        $attributes['project_id'] = $project_id;
        if (! $project_alert->update(\Input::all())) {
            \App::abort($project_alert->errors()->first());
        }
        return response()->json($project_alert->load('type'));
    }

    public function storeProjectAlert($project_id) {
        $attributes = \Input::all();
        $attributes['project_id'] = $project_id;
        if (! $project_alert = ProjectAlert::create($attributes)) {
            \App::abort($project_alert->errors()->first());
        }
        return response()->json($project_alert->load('type'));
    }

    public function deleteProjectAlert($project_id, $project_alert_id) {
        $project = Project::find($project_id);
        $project_alert = $project->project_alerts()->find($project_alert_id);
        $project_alert->delete();
        return response('Deleted', 200);
    }
}
