<?php

namespace App\Http\Controllers;

use App\Enums\CardPriority;
use App\Enums\CardStatus;
use App\Http\Requests\CardRequest;
use App\Http\Resources\CardSingleResource;
use App\Models\Card;
use App\Models\Workspace;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class CardController extends Controller
{
    //
    public function create(Workspace $workspace): Response
    {
        return inertia(component: 'Cards/Create', props: [
            'page_settings' => [
                'title' => 'Create Card',
                'subtitle' => 'Fill out this form to add new card',
                'method' => 'POST',
                'action' => route('cards.store', $workspace),
            ],
            'status' => request()->status ?? 'To Do',
            'statuses' => CardStatus::options(),
            'priority' => request()->priority ?? CardPriority::UNKNOWN->value,
            'priorities' => CardPriority::options(),
            'workspace' => fn() => $workspace->only('slug'),
        ]);
    }
    public function store(Workspace $workspace, CardRequest $request): RedirectResponse
    {
        $card = $request->user()->cards()->create([
            'workspace_id' => $workspace->id,
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
            'status' => $status = $request->status,
            'order' => $this->ordering($workspace, $status),
            'priority' => $request->priority,
        ]);
        flashMessage('Card information saved successfully');
        return to_route('workspaces.show', [$workspace]);
    }
    public function show(Workspace $workspace, Card $card): Response
    {
        return inertia('Cards/Show', props: [
            'card' => fn() => new CardSingleResource($card->load(['user', 'members', 'tasks', 'attachments'])),
            'page_settings' => [
                'title' => 'Detail Card',
                'subtitle' => 'You can see card information',
            ],
        ]);
    }
    public function edit(Workspace $workspace, Card $card): Response
    {
        return inertia('Cards/Edit', props: [
            'card' => fn() => new CardSingleResource($card->load(['members', 'user', 'tasks', 'attachments'])),
            'page_settings' => [
                'title' => 'Edit Card',
                'subtitle' => 'Fill out this form to edit card',
                'method' => 'PUT',
                'action' => route('cards.update', [$workspace, $card])
            ],
            'statuses' => CardStatus::options(),
            'priorities' => CardPriority::options(),
            'workspace' => fn() => $workspace->only('slug'),
        ]);
    }
    public function update(Workspace $workspace, Card $card, CardRequest $request): RedirectResponse
    {
        $last_status = $card->status->value;
        $card->update([
            'title' => $request->title,
            'description' => $request->description,
            'deadline' => $request->deadline,
            'status' => $status = $request->status,
            'priority' => $request->priority,
            'order' => $this->ordering($workspace, $status),
        ]);
        $this->adjustOrdering($workspace, $last_status);
        flashMessage('Successfully updated card information');
        return back();
    }
    public function destroy(Workspace $workspace, Card $card): RedirectResponse
    {
        $last_status = $card->status->value;
        $card->delete();
        $this->adjustOrdering($workspace, $last_status);
        flashMessage('The card has been successfully deleted');
        return to_route('workspaces.show', $workspace);
    }
    public function ordering(Workspace $workspace, string $status): int
    {
        $last_card = Card::query()
            ->where('workspace_id', $workspace->id)
            ->where('status', $status)
            ->orderByDesc('order')
            ->first();

        // if ($last_card) return 1;
        // return $last_card->order + 1;
        return $last_card ? $last_card->order + 1 : 1;
    }
    public function adjustOrdering(Workspace $workspace, string $status)
    {
        $order = 1;
        return Card::where('workspace_id', $workspace->id)
            ->where('status', $status)
            ->orderBy('order')
            ->get()
            ->each(function ($card) use (&$order) {
                $card->order = $order;
                $card->save();
                $order++;
            });
    }
}
