<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImageRequest;
use App\Http\Requests\OpeningHoursRequest;
use App\Http\Requests\ShopRequest;
use App\Models\Log;
use App\Models\Rating;
use App\Models\OpeningHour;
use App\Models\Shop;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ShopController extends Controller
{
    public function index()
    {
        $shops = Shop::with("shopType")->where('is_deleted', 0)->paginate(8);
        return response()->json($shops);
    }

    public function get(Shop $shop)
    {
        $shop = Shop::with(["shopType", "openingHours" => function ($query) {
            $query->orderBy('id');
        }])->where("id", $shop->id)->first();
        $ratings = Rating::where("shop_id", $shop->id)->get();
        $ratingarray = [0, 0, 0, 0, 0];
        foreach ($ratings as $item) {
            switch ($item->rating) {
                case 1:
                    $ratingarray[0] += 1;
                    break;
                case 2:
                    $ratingarray[1] += 1;
                    break;
                case 3:
                    $ratingarray[2] += 1;
                    break;
                case 4:
                    $ratingarray[3] += 1;
                    break;
                case 5:
                    $ratingarray[4] += 1;
                    break;
                default:
                    return response()->json("Szerver hiba!", 500);
            }
        }
        $user = Auth::user();
        $yourrating = Rating::where("user_id", $user->id)->where("shop_id", $shop->id)->first();

        return response()->json(["shop" => $shop, "ratings" => ["star1" => $ratingarray[0], "star2" => $ratingarray[1], "star3" => $ratingarray[2], "star4" => $ratingarray[3], "star5" => $ratingarray[4]], "your_rating" => $yourrating === null ? 0 : $yourrating->rating], 200);
    }

    public function create(ShopRequest $request)
    {
        $user = Auth::user();
        $user = User::where("id", $user->id)->first();

        if ($user->shop_id != null) {
            return response("Csak az hoztak l??tre ??j boltot, aki nem tartozik m??g bolthoz!", 403);
        }

        $shop = new Shop();
        $shop->name = $request->get("name");
        $shop->shop_type_id = $request->get("shop_type_id");
        $shop->address = $request->get("address");
        $shop->owner = $request->get("owner");
        $shop->city = $request->get("city");
        $shop->save();

        $user->shop_id = $shop->id;
        $user->permission = 10;
        $user->save();

        $log = new Log();
        $log->shop_id = $shop->id;
        $log->user_id = $user->id;
        $log->description = $user->name . " sikeresen l??trehozta a boltot";
        $log->date = Carbon::now()->addHour(1);
        $log->save();

        $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        foreach ($daysOfWeek as $day) {
            $opening = new OpeningHour();
            $opening->shop_id = $shop->id;
            $opening->day = $day;
            $opening->save();
        }

        return response()->json($shop->id);
    }

    public function uploadImage(Shop $shop, ImageRequest $request)
    {
        if (Gate::denies('shop-worker', $shop->id) || Gate::denies('shop-manager')) {
            return response()->json("Csak a megfelel?? jogokkal lehet k??pet felt??lteni!", 403);
        }

        if ($shop->image_path != null && file_exists(public_path() . "/storage/" . $shop->image_path)) {
            unlink(public_path() . "/storage/" . $shop->image_path);
        }
        $newImageName = time() .
            '-' .
            $request->file('image')->getClientOriginalName();
        $request->file("image")
            ->move(storage_path('app/public'), $newImageName);
        $shop->image_path = $newImageName;
        $shop->save();

        $user = Auth::user();
        $log = new Log();
        $log->shop_id = $shop->id;
        $log->user_id = $user->id;
        $log->description = $user->name . " m??dos??totta a bolt k??p??t";
        $log->date = Carbon::now()->addHour(1);
        $log->save();

        return response()->json("K??p felt??lt??s sikeres!");
    }

    public function deleteImage(Shop $shop)
    {

        if (Gate::denies('shop-worker', $shop->id) || Gate::denies('shop-manager')) {
            return response()->json("Csak a megfelel?? jogokkal lehet k??pet t??r??lni!", 403);
        }

        if ($shop->image_path != null) {
            unlink(public_path() . "/storage/" . $shop->image_path);
            $shop->image_path = null;
            $shop->save();
            return response()->json("K??p sikeresen t??r??lve!");
        } else {
            return response()->json("Nem tal??lhat?? k??p enn??l a boltn??l!", 404);
        }
    }

    public function update(Shop $shop, ShopRequest $request)
    {
        if (Gate::denies('shop-worker', $shop->id) || Gate::denies('shop-manager')) {
            return response()->json("Csak a megfelel?? jogokkal lehet m??dos??tani a bolt adatain!", 403);
        }
        $user = Auth::user();
        $changedDatas = "";

        if ($shop->name != $request->get("name")) {
            $changedDatas = $changedDatas . " - Bolt neve: " . $shop->name . " -> " . $request->get("name");
            $shop->name = $request->get("name");
        }
        if ($shop->shop_type_id != $request->get("shop_type_id")) {
            $changedDatas = $changedDatas . " - Bolt t??pusa: " . $shop->shop_type_id . " -> " . $request->get("shop_type_id");
            $shop->shop_type_id = $request->get("shop_type_id");
        }
        if ($shop->address != $request->get("address")) {
            $changedDatas = $changedDatas . " - Bolt c??me: " . $shop->address . " -> " . $request->get("address");
            $shop->address = $request->get("address");
        }
        if ($shop->owner != $request->get("owner")) {
            $changedDatas = $changedDatas . " - Bolt tulajdonosa: " . $shop->owner . " -> " . $request->get("owner");
            $shop->owner = $request->get("owner");
        }
        if ($shop->city != $request->get("city")) {
            $changedDatas = $changedDatas . " - Bolt v??rosa: " . $shop->city . " -> " . $request->get("city");
            $shop->city = $request->get("city");
        }
        $shop->save();

        if ($changedDatas != "") {
            $log = new Log();
            $log->shop_id = $shop->id;
            $log->user_id = $user->id;
            $log->description = $user->name . " m??dos??totta a bolt adatait:" . $changedDatas;
            $log->date = Carbon::now()->addHour(1);
            $log->save();
        }

        $response = User::with('shop')->where('id', $user->id)->first();

        return response()->json(["message" => "A bolt adatai sikeresen megv??ltoztak", "user" => $response]);
    }

    public function delete(Shop $shop)
    {
        if (Gate::denies('shop-worker', $shop->id) || Gate::denies('shop-owner')) {
            return response()->json("Csak a bolt l??trehoz??ja tudja t??r??lni a boltot!", 403);
        }

        $workers = User::where('shop_id', $shop->id)->get();
        foreach ($workers as $worker) {
            $worker->shop_id = null;
            $worker->permission = 0;
            $worker->save();
        }

        $shop->is_deleted = true;
        $shop->save();
        return response()->json("Bolt sikeresen t??r??lve!");
    }
}
