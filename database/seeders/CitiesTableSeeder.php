<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class CitiesTableSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil data kota dari API Rajaongkir
        $response = Http::withHeaders([
            'key' => config('services.rajaongkir.api_key'),
        ])->get('https://api.rajaongkir.com/starter/city');

        // Loop untuk menyimpan setiap data kota ke tabel 'cities'
        foreach($response['rajaongkir']['results'] as $city) {
            City::create([
                'id'          => $city['city_id'],
                'province_id' => $city['province_id'],
                'name'        => $city['city_name'] . ' - (' . $city['type'] . ')',
            ]);
        }
    }
}
