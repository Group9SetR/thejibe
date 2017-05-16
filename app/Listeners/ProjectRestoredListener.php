<?php

namespace App\Listeners;

use App\Events\ProjectRestored;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProjectRestoredListener
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
     * @param  ProjectRestored  $event
     * @return void
     */
    public function handle(ProjectRestored $event)
    {
        $event->project->restore();
        $event->project->updateFromTW(); 
    }
}
