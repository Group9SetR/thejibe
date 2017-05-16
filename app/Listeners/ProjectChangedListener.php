<?php

namespace App\Listeners;

use App\Events\ProjectChanged;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProjectChangedListener
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
     * @param  ProjectChanged  $event
     * @return void
     */
    public function handle(ProjectChanged $event)
    {
        \App\Models\Project::updateOrCreateFromTWId($event->project_id, $event->user); 
    }
}
