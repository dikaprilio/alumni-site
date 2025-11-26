<?php

namespace App\Http\Controllers\Admin;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends BaseContentController
{
    protected function getModel()
    {
        return Event::class;
    }

    protected function getModelName()
    {
        return 'event';
    }

    protected function getRoutePrefix()
    {
        return 'admin.events';
    }

    protected function getViewPath()
    {
        return 'Admin/Events';
    }

    protected function getValidationRules(Request $request, $model = null)
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
            'description' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }

    protected function getSearchFields()
    {
        return ['title', 'location'];
    }

    protected function getOrderByColumn()
    {
        return 'event_date';
    }

    protected function getContentFieldName()
    {
        return 'description';
    }
}

