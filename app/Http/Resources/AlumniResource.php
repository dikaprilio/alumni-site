<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlumniResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Enforces privacy rules at the API level:
     * - private_email: Hides email unless user is admin
     * - private_phone: Hides phone unless user is admin
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isAdmin = $request->user()?->role === 'admin';
        
        // Get email from user relation (if exists)
        $email = $this->user?->email;
        
        // Apply privacy rules - only show if NOT private OR user is admin
        $showEmail = !$this->private_email || $isAdmin;
        $showPhone = !$this->private_phone || $isAdmin;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'nim' => $this->nim,
            'graduation_year' => $this->graduation_year,
            'major' => $this->major,
            'gender' => $this->gender,
            'address' => $this->address,
            'linkedin_url' => $this->linkedin_url,
            'avatar' => $this->avatar,
            'bio' => $this->bio,
            'featured_at' => $this->featured_at,
            'featured_reason' => $this->featured_reason,
            
            // Privacy-controlled fields
            'email' => $showEmail ? $email : null,
            'phone_number' => $showPhone ? $this->phone_number : null,
            
            // Privacy flags (for UI hints)
            'private_email' => $this->private_email,
            'private_phone' => $this->private_phone,
            
            // Computed attributes
            'profile_completeness' => $this->profile_completeness,
            'current_job' => $this->current_job,
            'current_position' => $this->current_position,
            'company_name' => $this->company_name,
            'missing_fields' => $this->missing_fields,
            
            // Relations (only when loaded)
            'skills' => $this->whenLoaded('skills'),
            'job_histories' => $this->whenLoaded('jobHistories'),
        ];
    }
}
