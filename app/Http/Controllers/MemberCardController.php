<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Member;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MemberCardController extends Controller
{
    public function store(Card $card, Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'string'],
        ]);
        $user = User::query()
            ->where('email', $request->email)
            ->first();
        if (!$user) {
            flashMessage('Unregistered user', 'error');
            return back();
        }
        if ($card->members()->where('user_id', $user->id)->exists()) {
            flashMessage('User is already a member of this card', 'error');
            return back();
        }
        $card->members()->create([
            'user_id' => $user->id,
            'role' => 'Member',
        ]);
        flashMessage('Member successfully invited.');
        return back();
    }
    public function destroy(Card $card, Member $member): RedirectResponse
    {
        $member->delete();
        flashMessage('Member successfully deleted.');
        return back();
    }
}
