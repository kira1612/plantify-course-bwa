<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class WorkspaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'visibility' => $this->visibility?->value,
            // 'visibility' => $this->visibility ? $this->visibility->value : null,
            // 'cover' => Storage::url($this->cover),
            'cover' => $this->cover ? asset('storage/' . ltrim($this->cover, '/')) : null,
            // 'cover' => $this->cover ? Storage::url($this->cover) : null,
            'logo' => $this->logo ? asset('storage/' . ltrim($this->logo, '/')) : null,
            // 'logo' => Storage::url($this->logo),
            'members' => MemberResource::collection($this->members),
        ];
    }
}
