<?php

namespace App\Listeners;

use App\Events\ProjectDeleted;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProjectDeletedListener
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
     * @param  ProjectDeleted  $event
     * @return void
     */
    public function handle(ProjectDeleted $event)
    {
        $event->project->delete(); 
    }
}
