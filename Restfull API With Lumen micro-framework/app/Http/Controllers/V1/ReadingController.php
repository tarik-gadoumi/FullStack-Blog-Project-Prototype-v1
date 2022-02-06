<?php

namespace App\Http\Controllers\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Models\Reading;
use Dingo\Api\Routing\Helpers;
use Illuminate\Validation\Rule;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;



class ReadingController extends Controller

{
    use Helpers ;
    public function __construct(Reading $reading )
{
            $this->reading = $reading;
}
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $records = $this->reading->where('owner_id','=',$this->user->id)->get();
        return [
            'data'=> $records
        ];

    }
    public function secondIndex()
    {
        $records = $this->reading->where('owner_id','=',$this->user->id)->where('finishDate','!=',null)->get();
        return [
            'data'=> $records
        ];
    }
    public function thirdIndex(){
        $records = $this->reading->where('owner_id','=',$this->user->id)->where('startDate','!=',null)->where('finishDate','=',null)->get();
        return [
            'data'=> $records
        ];
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
        // $input['user_id'] = $this->user->id;
      
        $validationRules = [
            'owner_id' => 'required|min:1|exists:users,id',
            'post_id' => 'required|min:1|exists:posts,id',
            'startDate'=>'required|min:1',
                // Change column_b here to the name of your input
            'post_id' => function ($attribute, $value, $fail) use ($request) {
                $columnB = $value;
                // Change column_a here to the name of your input
                $columnA = $request->input('owner_id');

                $records = DB::table('readings')
                    ->select('*')
                    // Change column_a here to the name of column A in your database
                    ->where('owner_id', $columnA)
                    // Change column_b here to the name of column B in your database
                    ->where('post_id', $columnB)
                    ->count();

                if($records > 0) {
                   $fail("not allowed because value $columnB in Column B has already been set for value $columnA in column A");
                }
            },
            ];
            $validator = \Validator::make($input, $validationRules);
            if ($validator->fails()) {
            return new \Illuminate\Http\JsonResponse(
            [
            'errors' => $validator->errors()
            ], \Illuminate\Http\Response::HTTP_BAD_REQUEST
            );
            }
        $TheReading=$this->reading->create($input);
        return [
        'data' => $input
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($post,Request $request)
    {
        
        $input = $request->all();
        $the_right_row_to_update = $this
        ->reading
        ->where('owner_id','=',$this->user->id)
        ->where('post_id','=',$post)
        ->first();
        
        
        if (!$the_right_row_to_update) {
            abort(404);
        }


        // i  need  verification  here ! Only reader  can  update this field 

        $the_right_row_to_update->fill($input);
        $the_right_row_to_update->save();
         return [
             'successfuly updated' =>  $the_right_row_to_update,
             'input'=> $input
         ];
        // return $this->response->item($Thepost, $this->transformer);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($post , Request $request)
    {
        $Thereading = $this
        ->reading
        ->where('owner_id','=',$this->user->id)
        ->where('post_id','=',$post);
        if (!$Thereading) {
            abort(404);
        }
        // $record_exists_for_Other_users = DB::table('readings')->where('owner_id','!=',$this->user->id)->where('post_id','=',$post)->exists() ;

        //  if ($record_exists_for_Other_users && !($this->user->id)) {
        //     return new JsonResponse(
        //         [
        //             'errors' => 'Only Post Owner can delete it'
        //         ],
        //         Response::HTTP_FORBIDDEN
        //     );
        // }

        $Thereading->delete();
        return ['message' => 'deleted successfully', 'post_id' => $post, 'user'=> $this->user->id ];
    }
}
