<?php
namespace App\Http\Controllers;

use App\Models\RecoveryCode;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RecoveryCodeController extends Controller
{
    public function generate(Request $request)
    {
        // Check if a recovery code already exists for the user
        $existingCode = $request->user()->recoveryCodes()->first();

        if ($existingCode) {
            return response()->json([
                'code' => $existingCode->code,
                'is_code_copied' => $existingCode->is_code_copied
            ]);
        }

        // Generate a single long random recovery code
        $code = strtoupper(Str::random(64));

        // Save the recovery code
        $recoveryCode = new RecoveryCode([
            'user_id' => $request->user()->id,
            'code' => $code,
            'is_code_copied' => false,
        ]);
        $recoveryCode->save();

        return response()->json([
            'code' => $code,
            'is_code_copied' => false
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'recovery_code' => 'required|string'
        ]);

        $code = RecoveryCode::where('user_id', $request->user()->id)
            ->where('code', strtoupper($request->recovery_code))
            ->first();

        if (!$code) {
            return response()->json([
                'message' => 'Invalid recovery code'
            ], 422);
        }

        // Reset Google 2FA settings
        $user = $request->user();
        $user->google2fa_secret = null;
        $user->google2fa_enabled = false;
        $user->save();

        // Update the settings
        $settings = Setting::where('user_id', $user->id)->first();
        if ($settings) {
            $settings->is_google2fa_enabled = false;
            $settings->save();
        }

        // Redirect to the dashboard
        return redirect('/dashboard')->with('success', 'Recovery code verified successfully. Google 2FA settings have been reset.');
    }

    public function index(Request $request)
    {
        $code = $request->user()
            ->recoveryCodes()
            ->first(['code', 'created_at', 'is_code_copied']);

        return response()->json(['code' => $code]);
    }

    public function markCopied(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $code = RecoveryCode::where('user_id', $request->user()->id)
            ->where('code', strtoupper($request->code))
            ->first();

        if ($code) {
            $code->update(['is_code_copied' => true]);
            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false], 422);
    }
}