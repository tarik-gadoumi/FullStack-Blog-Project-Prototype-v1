<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use  Tymon\JWTAuth\JWT;

use App\Models\User;

class RegisterController extends Controller
{
    public function __construct(User $user, JWT $jwt)
    {
        $this->user = $user;
        $this->jwt = $jwt;
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $input = $request->all();
        $inputWithPassHashed = ['email' => $input['email'], 'name' => $input['name'], 'password' => app('hash')->make($input['password'])];
        $validationRules = [
            'name' => 'required|min:1|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:1',

        ];
        $validator = \Validator::make($input, $validationRules);
        if ($validator->fails()) {

            return new \Illuminate\Http\JsonResponse(
                [
                    'errors' => $validator->errors()
                ],
                \Illuminate\Http\Response::HTTP_BAD_REQUEST
            );
        } else {
            $TheUser = $this->user->create($inputWithPassHashed);
        }


        return [
            'data' => array_merge($TheUser->only('id', 'name'), ['token' => $this->jwt->fromUser($TheUser)]),

            'message' => 'Thanks for signing up! Please check your e-mail to complete your registration.'
        ];
        //return $this->response->item($Thepost, $this->transformer);
    }
}
