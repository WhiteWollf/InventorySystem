<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with("shop")->get();
        return response()->json($users);
    }

    public function create(UserRequest $request)
    {
        $user = new User();

        $user->email = $request->get("email");
        $user->name = $request->get("name");
        $user->password = Hash::make($request->get("password"));
        $user->permission = $request->has("permission") ? $request->get("permission") : null;
        $user->postal_code = $request->has("postal_code") ? $request->get("postal_code") : null;
        $user->shop_id = $request->has("shop_id") ? $request->get("shop_id") : null;

        $user->save();
        return response()->json($user->id);
    }

    public function update(User $user, UserRequest $request)
    {
        $user->email = $request->get("email");
        $user->name = $request->get("name");
        $user->password = Hash::make($request->get("password"));
        $user->permission = $request->has("permission") ? $request->get("permission") : null;
        $user->postal_code = $request->has("postal_code") ? $request->get("postal_code") : null;
        $user->shop_id = $request->has("shop_id") ? $request->get("shop_id") : null;

        $user->save();
        return response()->json($user->toArray());
    }

    public function delete(User $user)
    {
        $user->delete();
        return response()->json("OK");
    }

    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => "Hibás felhasználónév vagy jelszó!"], 401);
        };
        $user->password = null;
        return response()->json($user);
    }

    public function register(RegisterRequest $request)
    {
        /*$request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', Password::defaults()->min(8)->mixedCase()->numbers()]
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => Password::defaults()->min(8)->mixedCase()->numbers()
        ]);

        if ($validator->fails()) {
            return response($validator->errors());
        }*/

        $user = new User();

        $user->email = $request->get("email");
        $user->name = $request->get("name");
        $user->password = Hash::make($request->get("password"));
        $user->postal_code = $request->has("postal_code") ? $request->get("postal_code") : null;

        $user->save();
        return response()->json($user->id);
    }
}
