<?php

namespace App\Http\Controllers\V1;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use Tymon\JWTAuth\JWTAuth;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exception\HttpResponseException;

class AuthController extends Controller
{
   
    // /**
    //  * @var \Tymon\JWTAuth\JWTAuth
    //  */
    // protected $jwt;

    // public function __construct(JWTAuth $jwt)
    // {
    //     $this->jwt = $jwt;
    // }

    // public function postLogin(Request $request)
    // {
    //     $this->validate($request, [
    //         'email'    => 'required|email|max:255',
    //         'password' => 'required',
    //     ]);

    //     try {

    //         if (! $token = $this->jwt->attempt($request->only('email', 'password'))) {
    //             return response()->json(['user_not_found'], 404);
    //         }

    //     } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

    //         return response()->json(['token_expired'], 500);

    //     } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

    //         return response()->json(['token_invalid'], 500);

    //     } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {

    //         return response()->json(['token_absent' => $e->getMessage()], 500);

    //     }

    //     return response()->json(compact('token'));
    // }
    public function postLogin(Request $request)
    {
        try {
            $this->validate($request, [
                'email' => 'required|email|max:255',
                'password' => 'required',
            ]);
        } catch (ValidationException $e) {
            return $e->getResponse();
        }

        try {
            // Attempt to verify the credentials and create a token for the user
            if (!$token = JWTAuth::attempt(
                $this->getCredentials($request)
            )) {
                return $this->onUnauthorized();
            }
        } catch (JWTException $e) {
            // Something went wrong whilst attempting to encode the token
            return $this->onJwtGenerationError();
        }

        // All good so return the token
        return $this->onAuthorized($token,$request) ;
    }

    /**
     * What response should be returned on invalid credentials.
     *
     * @return JsonResponse
     */
    protected function onUnauthorized()
    {
        return new JsonResponse([
            'message' => 'invalid_credentials'
        ], Response::HTTP_UNAUTHORIZED);
    }

    /**
     * What response should be returned on error while generate JWT.
     *
     * @return JsonResponse
     */
    protected function onJwtGenerationError()
    {
        return new JsonResponse([
            'message' => 'could_not_create_token'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * What response should be returned on authorized.
     *
     * @return JsonResponse
     */
    protected function onAuthorized($token,$request)
    {
        return new JsonResponse([
            'message' => 'token_generated',
            'data' => array_merge(
                ["token" => $token] ,
                $request->user()->only('id','name')
            ),
           
        ]);
    }

    /**
     * Get the needed authorization credentials from the request.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    protected function getCredentials(Request $request)
    {
        return $request->only('email', 'password');
    }

    /**
     * Invalidate a token.
     *
     * @return \Illuminate\Http\Response
     */
    public function deleteInvalidate()
    {
        $token = JWTAuth::parseToken();

        $token->invalidate();

        return new JsonResponse(['message' => 'token_invalidated']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\Response
     */
    public function patchRefresh()
    {
        $token = JWTAuth::parseToken();

        $newToken = $token->refresh();

        return new JsonResponse([
            'message' => 'token_refreshed',
            'data' => [
                'token' => $newToken
            ]
        ]);
    }

    /**
     * Get authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function getUser()
    {
        return new JsonResponse([
            'message' => 'authenticated_user',
            'data' => JWTAuth::parseToken()->authenticate()->only('id','name'),            
        ]);
    }
}
