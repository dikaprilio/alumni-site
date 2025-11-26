<?php

namespace App\Http\Controllers\Admin;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends BaseContentController
{
    protected function getModel()
    {
        return News::class;
    }

    protected function getModelName()
    {
        return 'news';
    }

    protected function getRoutePrefix()
    {
        return 'admin.news';
    }

    protected function getViewPath()
    {
        return 'Admin/News';
    }

    protected function getValidationRules(Request $request, $model = null)
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }

    protected function getSearchFields()
    {
        return ['title', 'category'];
    }

    protected function getOrderByColumn()
    {
        return 'created_at';
    }

    protected function getContentFieldName()
    {
        return 'content';
    }
}

