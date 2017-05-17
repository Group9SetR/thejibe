@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div id="project" class="panel-heading" data-project-id="{{ $project->id }}" data-user-id="{{ $user->id }}">
                    <h3>{{ $project->name }}</h3>
                    <div id="">
                        Total hours
                        <div id="edit-project-total-hours" style="display:none">
                            <input type="text" id="project-total-hours-input" placeholder="amount..." value="" class="" style="width:63px;" name="">
                            <div style="display:inline;"><input id="submit-project-total-hours" type="submit" class="action btn btn-success" value="Save"> or <a href="">Cancel</a></div>
                        </div>
                        <strong><span id="project-total-hours" class="strong" style="display:inline">{{ $project->total_hours }}</span></strong>
                    </div>
                </div>
                <div class="panel-body row-fluid monitor">
                    <ul id="monitor-weekly" class="monitor-inline">
                        <li class="monitor-header">This Week</li>
                        <li class="monitor-billable"><span class="monitor-hours">{{ $project->billable_hours_sum_weekly }}</span>Hrs.</li>
                        <li class="monitor-non-billable"><span class="monitor-hours">{{ $project->non_billable_hours_sum_weekly }}</span>Hrs.</li>
                        <li class="monitor-total"><span class="monitor-hours">{{ $project->total_hours_sum_weekly }}</span>Hrs.</li>
                    </ul>
                    <ul id="monitor-monthly" class="monitor-inline">
                        <li class="monitor-header">This Month</li>
                        <li class="monitor-billable"><span class="monitor-hours">{{ $project->billable_hours_sum_monthly }}</span>Hrs.</li>
                        <li class="monitor-non-billable"><span class="monitor-hours">{{ $project->non_billable_hours_sum_monthly }}</span>Hrs.</li>
                        <li class="monitor-total"><span class="monitor-hours">{{ $project->total_hours_sum_monthly }}</span>Hrs.</li>
                    </ul>
                    <ul id="monitor-yearly" class="monitor-inline">
                        <li class="monitor-header">This Year</li>
                        <li class="monitor-billable"><span class="monitor-hours">{{ $project->billable_hours_sum_yearly }}</span>Hrs.</li>
                        <li class="monitor-non-billable"><span class="monitor-hours">{{ $project->non_billable_hours_sum_yearly }}</span>Hrs.</li>
                        <li class="monitor-total"><span class="monitor-hours">{{ $project->total_hours_sum_yearly }}</span>Hrs.</li>
                    </ul>
                    <ul id="monitor-total" class="monitor-inline">
                        <li class="monitor-header">Project's Life</li>
                        <li class="monitor-billable"><span class="monitor-hours">{{ $project->billable_hours_sum }}</span>Hrs.</li>
                        <li class="monitor-non-billable"><span class="monitor-hours">{{ $project->non_billable_hours_sum }}</span>Hrs.</li>
                        <li class="monitor-total"><span class="monitor-hours">{{ $project->total_hours_sum }}</span>Hrs.</li>
                    </ul>
                    <div class="monitor-reference"><span class="monitor-billable">Billable</span>, <span class="monitor-non-billable">Non-Billable</span>, <span class="monitor-total">Total</span></div>
                </div>
                <div class="panel-body project-alerts">
                    <h4>Alerts</h4>
                    <ul>
                        @foreach ($project->project_alerts as $project_alert)
                            <li id="project-alert-{{ $project_alert->id }}" data-project-alert-id={{ $project_alert->id }}>
                                <p> 
                                <input id="remove-project-alert-{{ $project_alert->id }}" type="submit" class="action btn btn-danger btn-remove" value="-">                                    
                                Send 
                                {{ strtolower($project_alert->type->name) }}
                                alert to                                
                                '{{ $project_alert->emails }}'                                
                                when 
                                {{ $project_alert->amount }} {{ $project_alert->amount_type }}                                
                                of the
                                {{ $project_alert->hours_type }}                                
                                hours are reached.
                                </p>
                            </li>
                        @endforeach
                        <li id="new-project-alert">
                            <p>
                                <input id="add-project-alert" type="submit" class="action btn btn-success btn-add" value="+">
                                Send 
                                <select id="project-alert-type">
                                @foreach ($projectAlertTypes as $projectAlertType)
                                    <option value="{{ $projectAlertType->id }}">{{ strtolower($projectAlertType->name) }}</option>
                                @endforeach
                                </select>
                                alert to                                
                                <input id="emails" type="text" id="" placeholder="comma separated emails list..." value="" class="" style="width:187px;" name="">
                                when 
                                <input id="amount" type="text" id="" placeholder="amount..." value="" class="" style="width:63px;" name="" align="right">
                                <select id="amount-type"><option value="hours">hour(s)</option><option value="percentage">percent</option></select>
                                of the
                                <select id="hours-type"><option value"billable">billable</option><option value"non_billable">non-billable</option><option value="total">total</option></select>
                                hours are reached.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="/assets/js/project.js"></script>
<script src="/assets/js/projectAlert.js"></script>
@endsection
