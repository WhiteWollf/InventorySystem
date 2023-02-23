<?php

namespace Database\Seeders;

use App\Models\OpeningHour;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OpeningHoursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'id' => 1,
                'shop_id' => 1,
                'day' => "Hétfő",
                'is_open' => false,
            ],
            [
                'id' => 2,
                'shop_id' => 1,
                'day' => "Kedd",
                'is_open' => true,
                'open' => "08:00",
                'close' => "16:00",
            ],
            [
                'id' => 3,
                'shop_id' => 1,
                'day' => "Szerda",
                'is_open' => true,
                'open' => "08:00",
                'close' => "16:00",
            ],
            [
                'id' => 4,
                'shop_id' => 1,
                'day' => "Csütörtök",
                'is_open' => true,
                'open' => "08:00",
                'close' => "16:00",
            ],
            [
                'id' => 5,
                'shop_id' => 1,
                'day' => "Péntek",
                'is_open' => true,
                'open' => "08:00",
                'close' => "16:00",
            ],
            [
                'id' => 6,
                'shop_id' => 1,
                'day' => "Szombat",
                'is_open' => true,
                'open' => "08:00",
                'close' => "20:00",
            ],
            [
                'id' => 7,
                'shop_id' => 1,
                'day' => "Vasárnap",
                'is_open' => false
            ]
        ];

        foreach ($data as $item) {
            $openingHour = OpeningHour::firstOrNew([
                'id' => $item['id']
            ]);

            foreach ($item as $key => $value) {
                $openingHour->{$key} = $value;
            };

            $openingHour->save();
        }
    }
}