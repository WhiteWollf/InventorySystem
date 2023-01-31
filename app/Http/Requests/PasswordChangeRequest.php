<?php

namespace App\Http\Requests;

use App\Rules\PasswordMixedCase;
use App\Rules\PasswordNumber;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator as Validator;
use Illuminate\Validation\ValidationException;

class PasswordChangeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'old-password' => 'required',
            'new-password' => ['required', 'min:8', 'max:255', new PasswordMixedCase, new PasswordNumber],
            'new-password-repeat' => 'required|same:new-password'
        ];
    }

    public function messages()
    {
        return [
            'password.required' => 'Jelszó megadása kötelező!',
            'password.min' => 'Jelszó legalább 8 karakter hosszúságú!',
            'password.max' => 'Jelszó maximum 255 karakter hosszúságú!',
            'password-repeat.required' => 'Jelszó ismétlés megadása kötelező!',
            'password-repeat.same' => 'Jelszó ismétlés nem eggyezik!'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw (new ValidationException($validator, response()->json($validator->errors(), 422)));
    }
}