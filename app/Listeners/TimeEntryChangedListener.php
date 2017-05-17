<?php

namespace App\Listeners;

use App\Events\TimeEntryChanged;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class TimeEntryChangedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  TimeEntryChanged  $event
     * @return void
     */
    public function handle(TimeEntryChanged $event)
    {
        $event->project->updateTimeTotals(); 
        $event->project->company->updateTimeTotals(); 
        foreach ($event->project->project_alerts as $project_alert) {
            $project_alert->check();
        }
        foreach ($event->project->company->project_alerts as $project_alert) {
            $project_alert->check();
        }  
    }
}
