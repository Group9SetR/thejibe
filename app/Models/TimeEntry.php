<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\TeamWorkApiConsumer;

class TimeEntry extends Model {

    /**
     * Methods.
     *
     */
    public static function getFromTWId($id, $user = null) {
        if (! $user) $user = \Auth::User();
        $client = new TeamWorkApiConsumer($user->api_token, $user->account->code);
        return $client->getTimeEntry($id);
    }
}
