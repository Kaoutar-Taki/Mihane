<?php

namespace App\Http\Controllers;

use App\Models\ArtisanProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function overview(Request $request)
    {
        // KPIs
        $totalUsers = User::count();
        $verifiedArtisans = ArtisanProfile::where('verify_status', 'VERIFIED')->count();
        $pendingRequests = ArtisanProfile::where('verify_status', 'PENDING')->count();
        $criticalErrors = 0; // placeholder unless you have a logs table

        // Series: last 30 days new users and new artisans per day
        $days = 30;
        $from = now()->subDays($days-1)->startOfDay();
        $usersPerDay = User::where('created_at', '>=', $from)
            ->select(DB::raw('DATE(created_at) as d'), DB::raw('COUNT(*) as c'))
            ->groupBy('d')->pluck('c', 'd');
        $artisansPerDay = ArtisanProfile::where('created_at', '>=', $from)
            ->select(DB::raw('DATE(created_at) as d'), DB::raw('COUNT(*) as c'))
            ->groupBy('d')->pluck('c', 'd');
        $dates = [];
        $signups = [];
        $profiles = [];
        for ($i=0; $i<$days; $i++) {
            $d = $from->copy()->addDays($i)->toDateString();
            $dates[] = $d;
            $signups[] = (int)($usersPerDay[$d] ?? 0);
            $profiles[] = (int)($artisansPerDay[$d] ?? 0);
        }

        // Regions distribution placeholder (if you have regions relation attach real one)
        $regions = [
            ['region' => 'الرباط', 'visitors' => 0, 'growth' => '+0%'],
            ['region' => 'الدار البيضاء', 'visitors' => 0, 'growth' => '+0%'],
        ];

        return response()->json([
            'kpis' => [
                'totalUsers' => $totalUsers,
                'verifiedArtisans' => $verifiedArtisans,
                'pendingRequests' => $pendingRequests,
                'criticalErrors' => $criticalErrors,
            ],
            'series' => [
                'dates' => $dates,
                'signups' => $signups,
                'profiles' => $profiles,
            ],
            'regions' => $regions,
        ]);
    }
}
