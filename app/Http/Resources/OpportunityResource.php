<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OpportunityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Enforces privacy by not exposing full User model data.
     * Only returns necessary public information.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'company_name' => $this->company_name,
            'location' => $this->location,
            'contact_info' => $this->contact_info,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Alumni info - limited to public-safe data only
            'alumni' => $this->whenLoaded('alumni', function () {
                return [
                    'id' => $this->alumni->id,
                    'name' => $this->alumni->name,
                    'avatar' => $this->alumni->avatar,
                    'current_position' => $this->alumni->current_position,
                    'company_name' => $this->alumni->company_name,
                    // Explicitly NOT including: user relation, email, phone, etc.
                ];
            }),
        ];
    }
}
