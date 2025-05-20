<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('auth');

Route::controller(WorkspaceController::class)->group(function () {

    Route::get('workspaces/create', 'create')->name('workspaces.create');
    Route::post('workspaces/store', 'store')->name('workspaces.store');
    Route::get('workspaces/p/{workspaces:slug}', 'show')->name('workspaces.show');
    Route::get('workspaces/edit/{workspaces:slug}', 'edit')->name('workspaces.edit');
    Route::put('workspaces/edit/{workspaces:slug}', 'update')->name('workspaces.update');
    Route::delete('workspaces/destroy/{workspaces:slug}', 'destroy')->name('workspaces.destroy');
});

Route::get('testing', fn() => Inertia::render('Testing'));
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
