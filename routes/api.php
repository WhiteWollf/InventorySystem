<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopTypeController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\StorageController;
use Illuminate\Http\Request;
use App\Http\Controllers\UserController;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::group(['prefix' => '/users'], function () {
    Route::get("/", [UserController::class, "index"])->name("getUsers");
    Route::post("/create", [UserController::class, "create"])->name("createUser");
    Route::put("/{user}", [UserController::class, "update"])->name("updateUser");
    Route::delete("/{user}", [UserController::class, "delete"])->name("deleteUser");
});
Route::group(['prefix' => '/shops'], function () {
    Route::get("/", [ShopController::class, "index"])->name("getShops");
    Route::post("/create", [ShopController::class, "create"])->name("createShop");
    Route::put("/{shop}", [ShopController::class, "update"])->name("updateShop");
    Route::delete("/{shop}", [ShopController::class, "delete"])->name("deleteShop");
});
Route::group(['prefix' => '/shoptypes'], function () {
    Route::get("/", [ShopTypeController::class, "indextype"])->name("getShoptypes");
    Route::post("/create", [ShopTypeController::class, "createtype"])->name("createShoptype");
    Route::put("/{shoptype}", [ShopTypeController::class, "update"])->name("updateShoptype");
    Route::delete("/{shoptype}", [ShopTypeController::class, "delete"])->name("deleteshoptype");
});
Route::group(['prefix' => '/logs'], function () {
    Route::get("/", [LogController::class, "indexlog"])->name("getlogs");
    Route::post("/create", [LogController::class, "createlog"])->name("createlog");
    Route::delete("/{log}", [LogController::class, "deletelog"])->name("deletelog");
});
Route::group(['prefix' => '/products'], function () {
    Route::get("/", [ProductController::class, "indexproduct"])->name("getproducts");
    Route::post("/create", [ProductController::class, "createproduct"])->name("createproduct");
    Route::put("/{product}", [ProductController::class, "updateproduct"])->name("updateproduct");
    Route::delete("/{product}", [ProductController::class, "deleteproduct"])->name("deleteproduct");
});
Route::group(['prefix' => '/storage'], function () {
    Route::get("/", [StorageController::class, "indexstorage"])->name("getstorages");
    Route::post("/create", [StorageController::class, "createstorage"])->name("createstorage");
    Route::put("/{storage}", [StorageController::class, "updatestorage"])->name("updatestorage");
    Route::delete("/{storage}", [StorageController::class, "deletestorage"])->name("deletestorage");
});
Route::post("/login", [AuthController::class, "login"])->name("login");
Route::post("/register", [AuthController::class, "register"])->name("register");
