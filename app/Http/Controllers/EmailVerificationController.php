<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use App\Http\Requests\EmailVerify;
use App\Notifications\EmailVerifyMail;
use Illuminate\Support\Str;
use Mail;
use Hash;
use Carbon\Carbon;
use App\Models\User;
use App\Http\Requests\EmailVerifyTokenRequest;
use Illuminate\Support\Facades\DB;

class EmailVerificationController extends Controller
{

    public function EmailVerifyMail(EmailVerify $request)
    {
        if (DB::table('users')->where('email', '=', $request->email)->value('email_verified_at') === null) {
            $token = Str::random(64);
            if (DB::table('tokens')->where('email', '=', $request->email)->exists()) {
                DB::table('tokens')
                    ->where('email', 'LIKE', $request->email)
                    ->update(['tokenEmail' =>  $token, 'created_atEmail' => Carbon::now()->addHour()]);
            } else {
                DB::table('tokens')->insert([
                    'email' => $request->email,
                    'tokenEmail' => $token,
                    'created_atEmail' => Carbon::now()->addHour()
                ]);
            }

            $user = \App\Models\User::query()
                ->where([
                    'email' => $request->email,
                ])->first();
            $verify = [
                'greeting' => 'Hello ' . $user->name . ',',
                'body' => 'Az alábbi gombra kattintva tudja e-mail címét megerősíteni:',
                'thanks' => 'Köszönjük, hogy minket választott,',
                'actionText' => 'E-mail megerősítés',
                'actionURL' => url('InventorySystem/public/verification?tokenEmail=' . $token),
            ];

            $user->notify(new EmailVerifyMail($verify));
            return ['message' => 'E-mail sikeresen elküldve.'];
        } else {
            return response(['message' => 'Az E-mail cím már meg van erősítve.'], 400);
        }
    }

    public function EmailVerify(EmailVerifyTokenRequest $request)
    {
        $email = DB::table('tokens')
            ->where([
                'tokenEmail' => $request->tokenEmail
            ])
            ->value('email');

        User::where('email', $email)
            ->update(['email_verified_at' => Carbon::now()->addHour()]);

        DB::table('tokens')->where(['email' => $email])->update(['tokenEmail' =>  null, 'created_atEmail' => null]);;

        return ['message' => 'E-mail sikeresen megerősitve!'];
    }
}
