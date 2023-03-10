<?php

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Database\Seeder;

class ShopsSeeder extends Seeder
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
                'name' => "Tesco",
                'shop_type_id' => "2",
                'address' => "Pogányi út 7",
                'owner' => "Tesco PLC",
                'city' => "Kőszeg",
                'image_path' => "tesco1.jpg",
                'rating' => 4.75,
                'is_deleted' => false
            ],
            [
                'id' => 2,
                'name' => "Tesco",
                'shop_type_id' => "1",
                'address' => "Zanati út 70",
                'owner' => "Tesco PLC",
                'city' => "Szombathely",
                'image_path' => "tesco2.jpg",
                'rating' => 3.75,
                'is_deleted' => false
            ],
            [
                'id' => 3,
                'name' => "Coop",
                'shop_type_id' => "3",
                'address' => "Széchenyi tér 13",
                'owner' => "Co-op Hungary Zrt.",
                'image_path' => "coop1.jpg",
                'city' => "Cepreg",
                'rating' => 2.37,
                'is_deleted' => false
            ],
            [
                'id' => 4,
                'name' => "Varga PC MOBIL & Irodatechnika",
                'shop_type_id' => "3",
                'address' => "Várkör 16",
                'owner' => "Bestbyte műszaki",
                'image_path' => "vargapc.jpg",
                'city' => "Kőszeg",
                'rating' => 3,
                'is_deleted' => false
            ],
            [
                'id' => 5,
                'name' => "TESCO expressz",
                'shop_type_id' => "3",
                'address' => "IV. László király u. 39",
                'owner' => "Tesco PLC",
                'city' => "Sopron",
                'rating' => 1,
                'is_deleted' => false
            ],
            [
                'id' => 6,
                'name' => "TESCO expressz",
                'shop_type_id' => "3",
                'address' => "Király J. u 3",
                'owner' => "Tesco PLC",
                'city' => "Sopron",
                'rating' => 4.11,
                'is_deleted' => false
            ],
            [
                'id' => 7,
                'name' => "TESCO Hipermarket",
                'shop_type_id' => "2",
                'address' => "Ipar krt. 30",
                'owner' => "Tesco PLC",
                'city' => "Sopron",
                'rating' => 5,
                'is_deleted' => false
            ],
            [
                'id' => 8,
                'name' => "Tesco Expressz",
                'shop_type_id' => "3",
                'address' => "Hátsókapu 10",
                'owner' => "Tesco PLC",
                'city' => "Sopron",
                'rating' => 2,
                'is_deleted' => false
            ],
            [
                'id' => 9,
                'name' => "TESCO expressz",
                'shop_type_id' => "3",
                'address' => "Végfordulat 9",
                'owner' => " Peter Gazik",
                'city' => "Sopron",
                'rating' => 5
            ],
            [
                'id' => 10,
                'name' => "Yettel",
                'shop_type_id' => "3",
                'address' => " Ipar krt. 30",
                'owner' => "Tesco PLC",
                'city' => "Sopron",
                'rating' => 3.33
            ],
        ];
        foreach ($data as $item) {
            $shop = Shop::firstOrNew([
                'id' => $item['id']
            ]);

            foreach ($item as $key => $value) {
                $shop->{$key} = $value;
            };

            $shop->save();
        }
        Shop::factory()->count(10)->create();
    }
}
