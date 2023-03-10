<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\PasswordChangeRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        return response()->json("Sikeres regisztráció!");
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'A megadott email vagy jelszó helytelen'
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->is_deleted) {
            return response([
                'message' => 'A felhasználó nincs aktiválva!'
            ], 409);
        }
        if ($user->email_verified_at === null) {
            return response([
                'message' => 'Az email cím nincs hitelesítve'
            ], 403);
        }

        $token = $user->createToken('main')->plainTextToken;
        $user['password'] = "";
        $user = User::with('shop')->where('id', $user->id)->first();
        return response(compact('user', 'token'));
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }
}
